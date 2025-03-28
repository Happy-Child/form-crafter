1. **Валидация зависимости бюджета**: Сумма полей "Маркетинг", "Разработка", "Администрация", "Операции" должна равняться 100%.

2. **Валидация зависимости дат**: "Дата регистрации" ≤ "Дата начала" ≤ "Дата окончания" ≤ "Дата архивирования".

3. **Валидация комбинации полей**: Если заполнено одно из полей "Тип документа", "Номер документа", "Дата документа", "Организация", все остальные тоже обязательны.

4. **Динамическая логика**: Если роль "Администратор" — поле "Доступы" обязательно, иначе — нет.

5. **Числовые ограничения**: "Минимальная зарплата" < "Средняя зарплата" ≤ "Максимальная зарплата".

6. **Зависимость коэффициентов**: Сумма "Коэффициент 1" и "Коэффициент 2" равна фиксированному "Общему коэффициенту".

7. **Уникальность значений**: "Коды" — уникальны, минимум 3 значения.

8. **Зависимость пар значений**: "Возраст" в диапазоне "Минимальный возраст" — "Максимальный возраст", все поля обязательны, если заполнено хотя бы одно.

9. **Уникальность списка объектов**: В списке каждый объект имеет уникальную комбинацию "ID" и "Тип".

10. **Зависимость от контекста**: "Целевая сумма" > "Начальная сумма" (из контекста).

11. **Структура вложенных объектов**: Если есть "Данные пользователя", обязательны "Имя", "Email", "Роль".

12. **Зависимость от флага**: Если "Детали обязательны" = true, поля "Описание", "Причина", "Источник" обязательны.

13. **Условие по категории**: Если "Категория" = "Финансы", "Сумма" обязательна, "Описание" содержит "оплата".

14. **Зависимость бюджета (дубликат)**: Сумма "Маркетинг", "Разработка", "Администрация", "Операции" = 100% (повтор п.1).


### Дополнительно:
- **Тарифы**: 
  - "Базовый": до 5 пользователей, 1 месяц, без доп. услуг.
  - "Премиум": 1–50 пользователей, 1/6/12 месяцев, любые доп. услуги.
  - "Корпоративный": 10–1000 пользователей, 6–36 месяцев, только "Техподдержка 24/7" и "Выделенный менеджер".
- **Контактная информация**: Заполнено хотя бы одно из "Телефон" или "Email".
