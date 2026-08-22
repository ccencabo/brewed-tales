import { IsIn, IsOptional } from 'class-validator';
import { ShelfListingStatus } from '../../generated/prisma/enums';

export class ListShelfListingsQueryDto {
  @IsOptional()
  @IsIn([ShelfListingStatus.AVAILABLE, ShelfListingStatus.MATCHED])
  status?: ShelfListingStatus;
}
