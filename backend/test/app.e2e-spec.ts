import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from './../src/database/prisma.service';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let userId: number;
  let listingId: number;
  let authCookie: string;
  let ownerCookie: string;
  let savedBookId: number;
  let matchId: number;
  const authEmail = 'auth-e2e-reader@example.com';
  const ownerEmail = 'e2e-reader@example.com';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.shelfMatch.deleteMany({
      where: {
        OR: [
          { requester: { email: { in: [authEmail, ownerEmail] } } },
          { listing: { owner: { email: { in: [authEmail, ownerEmail] } } } },
        ],
      },
    });
    await prisma.savedBook.deleteMany({
      where: { user: { email: { in: [authEmail, ownerEmail] } } },
    });
    await prisma.shelfListing.deleteMany({
      where: { owner: { email: { in: [authEmail, ownerEmail] } } },
    });
    await prisma.user.deleteMany({
      where: { email: { in: [authEmail, ownerEmail] } },
    });

    const ownerRegistration = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: ownerEmail,
        displayName: 'E2E Reader',
        password: 'owner-password-123',
      })
      .expect(201);
    const ownerBody = ownerRegistration.body as unknown as {
      user: { id: number };
    };
    userId = ownerBody.user.id;
    const ownerCookies = ownerRegistration.headers['set-cookie'];
    ownerCookie = (
      Array.isArray(ownerCookies) ? ownerCookies[0] : ownerCookies
    ).split(';')[0];

    const testListing = await prisma.shelfListing.create({
      data: {
        ownerId: userId,
        coverColor: 'bg-sage',
        emoji: '📗',
        hook1: 'A hidden garden.',
        hook2: 'An unopened letter.',
        hook3: 'One impossible summer.',
        publicationYear: 1994,
        ingredients: ['mint', 'honey'],
        matchTags: ['cozy', 'mystery'],
      },
    });
    listingId = testListing.id;
  });

  it('/api/v1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1')
      .expect(200)
      .expect('Hello World!');
  });

  it('/api/v1/shelf-listings/:id rejects an anonymous request', () => {
    return request(app.getHttpServer())
      .get(`/api/v1/shelf-listings/${listingId}`)
      .expect(401);
  });

  it('/api/v1/shelf-listings rejects an anonymous request', () => {
    return request(app.getHttpServer())
      .get('/api/v1/shelf-listings')
      .expect(401);
  });

  it('/api/v1/auth/me returns a nullable user for an anonymous request', () => {
    return request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .expect(200)
      .expect({ user: null });
  });

  it('/api/v1/auth/register creates an account and session', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: authEmail.toUpperCase(),
        displayName: 'Auth Reader',
        password: 'tea-and-books-123',
      })
      .expect(201);

    expect(response.body.user).toMatchObject({
      email: authEmail,
      displayName: 'Auth Reader',
    });
    expect(response.body.user).not.toHaveProperty('passwordHash');

    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
    authCookie = (Array.isArray(cookies) ? cookies[0] : cookies).split(';')[0];
    expect(authCookie).toMatch(/^brewed_tales_session=/);

    const storedUser = await prisma.user.findUnique({
      where: { email: authEmail },
      select: { passwordHash: true },
    });
    expect(storedUser?.passwordHash).toMatch(/^\$argon2id\$/);
  });

  it('/api/v1/auth/me restores the user from the session cookie', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', authCookie)
      .expect(200);

    expect(response.body.user).toMatchObject({
      email: authEmail,
      displayName: 'Auth Reader',
    });
  });

  it('/api/v1/shelf-listings/:id returns a sanitized listing to a reader', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/v1/shelf-listings/${listingId}`)
      .set('Cookie', authCookie)
      .expect(200);

    expect(response.body).toMatchObject({
      id: listingId,
      hooks: [
        'A hidden garden.',
        'An unopened letter.',
        'One impossible summer.',
      ],
      publicationYear: 1994,
      owner: { displayName: 'E2E Reader' },
      isOwner: false,
    });
    expect(response.body).not.toHaveProperty('ownerId');
    expect(response.body).not.toHaveProperty('matchTags');
  });

  it('/api/v1/shelf-listings rejects an invalid status', () => {
    return request(app.getHttpServer())
      .get('/api/v1/shelf-listings?status=UNKNOWN')
      .set('Cookie', authCookie)
      .expect(400);
  });

  it('/api/v1/shelf-listings prevents removing another reader listing', () => {
    return request(app.getHttpServer())
      .delete(`/api/v1/shelf-listings/${listingId}`)
      .set('Cookie', authCookie)
      .expect(403);
  });

  it('/api/v1/shelf-listings creates a pending request without contact details', async () => {
    const claim = await request(app.getHttpServer())
      .post(`/api/v1/shelf-listings/${listingId}/claim`)
      .set('Cookie', authCookie)
      .send({ preferenceTags: ['cozy'] })
      .expect(201);

    const claimBody = claim.body as unknown as { id: number };
    matchId = claimBody.id;
    expect(claim.body).toMatchObject({
      listingId,
      owner: {
        displayName: 'E2E Reader',
      },
      status: 'pending',
    });
    expect(claim.body.owner).not.toHaveProperty('email');

    const library = await request(app.getHttpServer())
      .get('/api/v1/library')
      .set('Cookie', authCookie)
      .expect(200);
    expect(library.body).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: matchId })]),
    );

    const requesterExchanges = await request(app.getHttpServer())
      .get('/api/v1/exchanges')
      .set('Cookie', authCookie)
      .expect(200);
    expect(requesterExchanges.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: matchId,
          role: 'requester',
          status: 'pending',
          counterparty: { displayName: 'E2E Reader', email: null },
        }),
      ]),
    );
  });

  it('/api/v1/exchanges lets the owner accept and reveals contact details', async () => {
    const ownerView = await request(app.getHttpServer())
      .get('/api/v1/exchanges')
      .set('Cookie', ownerCookie)
      .expect(200);
    expect(ownerView.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: matchId,
          role: 'owner',
          actionRequired: true,
        }),
      ]),
    );

    await request(app.getHttpServer())
      .post(`/api/v1/exchanges/${matchId}/accept`)
      .set('Cookie', ownerCookie)
      .expect(201)
      .expect((response) => {
        expect(response.body).toMatchObject({
          status: 'accepted',
          counterparty: { displayName: 'Auth Reader', email: authEmail },
        });
      });

    const requesterView = await request(app.getHttpServer())
      .get('/api/v1/exchanges')
      .set('Cookie', authCookie)
      .expect(200);
    expect(requesterView.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: matchId,
          status: 'accepted',
          counterparty: { displayName: 'E2E Reader', email: ownerEmail },
        }),
      ]),
    );

    const library = await request(app.getHttpServer())
      .get('/api/v1/library')
      .set('Cookie', authCookie)
      .expect(200);
    expect(library.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: matchId, kind: 'shelfMatch', listingId }),
      ]),
    );
  });

  it('/api/v1/library persists and removes a recommended book', async () => {
    const saved = await request(app.getHttpServer())
      .post('/api/v1/library/books')
      .set('Cookie', authCookie)
      .send({
        externalBookId: 'google-books-e2e',
        title: 'The Test Book',
        author: 'Test Author',
        emoji: '📖',
        coverColor: 'bg-washi-mint/10',
        clues: ['A first clue', 'A second clue', 'A third clue'],
        ingredients: ['honey'],
      })
      .expect(201);
    const savedBody = saved.body as unknown as { id: number };
    savedBookId = savedBody.id;

    await request(app.getHttpServer())
      .delete(`/api/v1/library/books/${savedBookId}`)
      .set('Cookie', authCookie)
      .expect(204);
  });

  it('/api/v1/exchanges completes only after both readers confirm', async () => {
    await request(app.getHttpServer())
      .post(`/api/v1/exchanges/${matchId}/complete`)
      .set('Cookie', authCookie)
      .expect(201)
      .expect((response) => {
        expect(response.body).toMatchObject({
          status: 'accepted',
          completion: { requester: true, owner: false },
        });
      });

    await request(app.getHttpServer())
      .post(`/api/v1/exchanges/${matchId}/complete`)
      .set('Cookie', ownerCookie)
      .expect(201)
      .expect((response) => {
        expect(response.body).toMatchObject({
          status: 'completed',
          completion: { requester: true, owner: true },
        });
      });

    const completedListing = await prisma.shelfListing.findUnique({
      where: { id: listingId },
      select: { status: true },
    });
    expect(completedListing?.status).toBe('REMOVED');
  });

  it('/api/v1/exchanges lets an owner decline and retains the history', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/v1/shelf-listings')
      .set('Cookie', ownerCookie)
      .send({
        coverColor: 'bg-sage',
        emoji: '📘',
        hooks: ['A quiet village', 'A missing journal', 'A wintry secret'],
        ingredients: ['honey'],
      })
      .expect(201);
    const createdBody = created.body as unknown as { id: number };

    const claimed = await request(app.getHttpServer())
      .post(`/api/v1/shelf-listings/${createdBody.id}/claim`)
      .set('Cookie', authCookie)
      .send({})
      .expect(201);
    const claimedBody = claimed.body as unknown as { id: number };

    await request(app.getHttpServer())
      .post(`/api/v1/exchanges/${claimedBody.id}/decline`)
      .set('Cookie', ownerCookie)
      .expect(201)
      .expect((response) => expect(response.body.status).toBe('cancelled'));

    const history = await request(app.getHttpServer())
      .get('/api/v1/exchanges')
      .set('Cookie', authCookie)
      .expect(200);
    expect(history.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: claimedBody.id, status: 'cancelled' }),
      ]),
    );
  });

  it('/api/v1/auth/login rejects an incorrect password', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: authEmail, password: 'incorrect-password' })
      .expect(401);
  });

  it('/api/v1/auth/login issues a session for valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: authEmail,
        password: 'tea-and-books-123',
        rememberMe: true,
      })
      .expect(200);

    expect(response.headers['set-cookie']?.[0]).toContain('HttpOnly');
    expect(response.headers['set-cookie']?.[0]).toContain('Max-Age=604800');
  });

  it('/api/v1/auth/register rejects a duplicate email', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: authEmail,
        displayName: 'Another Reader',
        password: 'another-password-123',
      })
      .expect(409);
  });

  it('/api/v1/auth/logout clears the session cookie', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Cookie', authCookie)
      .expect(204);

    expect(response.headers['set-cookie']?.[0]).toContain(
      'brewed_tales_session=',
    );
    expect(response.headers['set-cookie']?.[0]).toContain(
      'Expires=Thu, 01 Jan 1970',
    );
  });

  afterAll(async () => {
    await prisma.shelfMatch.deleteMany({
      where: {
        OR: [
          { listing: { ownerId: userId } },
          { requester: { email: authEmail } },
        ],
      },
    });
    await prisma.savedBook.deleteMany({
      where: { user: { email: authEmail } },
    });
    await prisma.shelfListing.deleteMany({ where: { ownerId: userId } });
    await prisma.user.deleteMany({
      where: { email: { in: [authEmail, ownerEmail] } },
    });
    await app.close();
  });
});
