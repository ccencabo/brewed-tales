const BookshopSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 400 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bookshelf */}
    <rect x="60" y="80" width="280" height="180" rx="8" fill="hsl(37 45% 92%)" stroke="hsl(25 30% 18%)" strokeWidth="2" />
    
    {/* Shelf dividers */}
    <line x1="60" y1="140" x2="340" y2="140" stroke="hsl(25 30% 18%)" strokeWidth="2" />
    <line x1="60" y1="200" x2="340" y2="200" stroke="hsl(25 30% 18%)" strokeWidth="2" />
    
    {/* Top shelf books */}
    <rect x="75" y="88" width="18" height="46" rx="2" fill="hsl(18 65% 45%)" />
    <rect x="97" y="95" width="22" height="39" rx="2" fill="hsl(140 20% 55%)" />
    <rect x="123" y="90" width="16" height="44" rx="2" fill="hsl(350 30% 65%)" />
    <rect x="143" y="92" width="20" height="42" rx="2" fill="hsl(32 70% 55%)" />
    <rect x="167" y="88" width="14" height="46" rx="2" fill="hsl(25 30% 18%)" />
    <rect x="185" y="94" width="24" height="40" rx="2" fill="hsl(18 65% 45%)" />
    <rect x="215" y="90" width="18" height="44" rx="2" fill="hsl(350 30% 65%)" />
    <rect x="237" y="96" width="20" height="38" rx="2" fill="hsl(140 20% 55%)" />
    <rect x="261" y="88" width="16" height="46" rx="2" fill="hsl(32 70% 55%)" />
    <rect x="281" y="92" width="22" height="42" rx="2" fill="hsl(18 65% 45%)" />
    <rect x="307" y="90" width="18" height="44" rx="2" fill="hsl(25 30% 18%)" />

    {/* Middle shelf books */}
    <rect x="80" y="148" width="20" height="46" rx="2" fill="hsl(32 70% 55%)" />
    <rect x="104" y="152" width="16" height="42" rx="2" fill="hsl(25 30% 18%)" />
    <rect x="124" y="148" width="22" height="46" rx="2" fill="hsl(350 30% 65%)" />
    <rect x="150" y="154" width="18" height="40" rx="2" fill="hsl(140 20% 55%)" />
    {/* Cup */}
    <ellipse cx="190" cy="194" rx="12" ry="4" fill="hsl(37 35% 85%)" />
    <rect x="178" y="176" width="24" height="18" rx="4" fill="hsl(37 35% 85%)" stroke="hsl(25 30% 18%)" strokeWidth="1.5" />
    <path d="M202 180 Q212 182 212 188 Q212 194 202 194" stroke="hsl(25 30% 18%)" strokeWidth="1.5" fill="none" />
    {/* Steam */}
    <path d="M186 174 Q188 168 186 162" stroke="hsl(25 15% 45%)" strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M192 174 Q194 166 192 160" stroke="hsl(25 15% 45%)" strokeWidth="1" fill="none" opacity="0.4" />
    
    <rect x="220" y="148" width="14" height="46" rx="2" fill="hsl(18 65% 45%)" />
    <rect x="238" y="152" width="24" height="42" rx="2" fill="hsl(32 70% 55%)" />
    <rect x="266" y="148" width="18" height="46" rx="2" fill="hsl(140 20% 55%)" />
    <rect x="288" y="150" width="20" height="44" rx="2" fill="hsl(350 30% 65%)" />

    {/* Bottom shelf - plant and books */}
    <rect x="75" y="208" width="22" height="46" rx="2" fill="hsl(140 20% 55%)" />
    <rect x="101" y="212" width="18" height="42" rx="2" fill="hsl(18 65% 45%)" />
    <rect x="123" y="208" width="16" height="46" rx="2" fill="hsl(32 70% 55%)" />
    
    {/* Plant pot */}
    <rect x="165" y="235" width="30" height="19" rx="3" fill="hsl(18 65% 45%)" />
    <ellipse cx="180" cy="235" rx="16" ry="3" fill="hsl(140 25% 40%)" />
    <path d="M175 235 Q172 218 180 210 Q188 218 185 235" fill="hsl(140 20% 55%)" />
    <path d="M180 232 Q176 222 182 215" stroke="hsl(140 25% 40%)" strokeWidth="1" fill="none" />
    
    <rect x="220" y="210" width="20" height="44" rx="2" fill="hsl(350 30% 65%)" />
    <rect x="244" y="208" width="14" height="46" rx="2" fill="hsl(25 30% 18%)" />
    <rect x="262" y="214" width="22" height="40" rx="2" fill="hsl(32 70% 55%)" />
    <rect x="288" y="208" width="18" height="46" rx="2" fill="hsl(18 65% 45%)" />
    <rect x="310" y="212" width="16" height="42" rx="2" fill="hsl(140 20% 55%)" />

    {/* Cat sitting on top */}
    <ellipse cx="300" cy="78" rx="16" ry="10" fill="hsl(25 30% 18%)" />
    <circle cx="296" cy="66" r="10" fill="hsl(25 30% 18%)" />
    {/* Ears */}
    <polygon points="289,58 292,48 296,58" fill="hsl(25 30% 18%)" />
    <polygon points="300,58 303,48 307,58" fill="hsl(25 30% 18%)" />
    {/* Eyes */}
    <circle cx="293" cy="64" r="2" fill="hsl(32 70% 55%)" />
    <circle cx="299" cy="64" r="2" fill="hsl(32 70% 55%)" />
    {/* Tail */}
    <path d="M316 78 Q325 70 320 60" stroke="hsl(25 30% 18%)" strokeWidth="3" strokeLinecap="round" fill="none" />

    {/* Tiny "BOOKS" sign */}
    <rect x="150" y="40" width="100" height="28" rx="4" fill="hsl(37 45% 92%)" stroke="hsl(25 30% 18%)" strokeWidth="1.5" />
    <text x="200" y="58" textAnchor="middle" fill="hsl(25 30% 18%)" fontFamily="serif" fontSize="14" fontWeight="bold">BOOKS</text>
  </svg>
);

export default BookshopSVG;
