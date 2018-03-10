# Скрипт для генерации ttf файла для шрифта Krungthep

В этой папке находится [скрипт](http://fontforge.github.io/en-US/tutorials/scripting/) для [FontForge](http://fontforge.github.io/), извлекающий определённые символы из шрифта. 

В макете использовался шрифт Krungthep, в интернете [был найден этот шрифт](https://github.com/justrajdeep/fonts/blob/master/Krungthep.ttf), но он имел размер ~180КБ, а так как из этого шрифта нужны только цифры и знак минус, то можно существенно оптимизировать размер файла шрифта путём удаления всех ненужных символов. Именно это выполняется в shell скрипте `extract.sh`

Запускается он так:

    ./extract.sh Krungthep-source.ttf Krungthep-reduced.ttf
