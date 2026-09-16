# SneakMax frontend — v1

Первый frontend-срез по предоставленному PDF-макету.

## Структура

- `templates/index.html` — страница и HTML-контракты для backend.
- `static/css/style.css` — стили и responsive.
- `static/js/main.js` — burger, FAQ, размеры, диапазон цены, quiz, форма.
- `static/images/` — сюда кладутся реальные изображения из макета.

## Backend contracts

### Products

`products` ожидается как коллекция объектов с минимум:

- `image`
- `name`
- `price`

Дополнительные поля можно добавлять без изменения разметки.

### Feedback

Форма использует:

- `name`
- `phone`

JS сейчас не делает реальный POST: endpoint специально оставлен за Flask.

### Quiz

Поля:

- `type`
- `size`
- `name`
- `email`

## Важное замечание

Точные font-family и оригинальные изображения не были доступны как отдельные Figma-ресурсы через предоставленный PDF. Поэтому CSS использует Montserrat с fallback, а изображения ожидаются в `static/images/`. Не считаю эту часть окончательным pixel-perfect результатом — после получения оригинальных assets/Figma-значений их нужно заменить без изменения структуры.
