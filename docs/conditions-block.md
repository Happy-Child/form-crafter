- список опереаций определять по: 1. типу компонента; 2. В зависимости от типа смотрим optionsBuilder.value, если editable. 3. Операции доя этого коркнернтого поля.
По полю операции не всё понятно, какая будет стурктура и как сделать чтобы поле значения было не обязательным, не поянтно. Для isEmpty, isRequired например.


Интерфейс блока условий применения какого-то правила:
- Поле/переменная — выбор поля формы (например, "Возраст", "Выбор опции").
- Оператор сравнения — выбор типа проверки (равно, ≠, >, <, ≥, ≤, содержит, не содержит).
- Значение — ввод или выбор значения для проверки (число, текст, опция и т.д.).
- Логический оператор — выбор "&" (И) или "||" (ИЛИ) для связи с другим условием (опционально).

Не ясно как для templateComponent из repeater сделать добавление в условия.
