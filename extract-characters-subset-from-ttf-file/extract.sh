#!/usr/bin/env fontforge

Open($1, 1);
SelectAll();

# цифры
SelectFewer(0u30, 0u39);
# минус
SelectFewer(0u2d);
# плюс
SelectFewer(0u2b);
# пробел
SelectFewer(0u20);

DetachAndRemoveGlyphs();
Reencode('compacted');
Generate($2);
Quit(0);
