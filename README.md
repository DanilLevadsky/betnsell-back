# BetNSell
## _Достойная азарт-платформа для продажи товаров_

BetNSell - это первая украинская web платформа для покупки и продажи вещей путем розыгрыша.
### Функционал
- Двухфакторная регистрация и авторизация
- Просмотр и редактирование профиля
- Пополнение баланса
- Покупка билетов
- Создание и редактирование лота

### Предварительный вариант дизайна на [Figma](https://www.figma.com/file/shalRMjovyF7eh2C2Bw4Gv/Online-Casino?node-id=0%3A1)

### Схематическое отображение модульной архитектуры проекта
<img style="width=400px;height=300px" src="/images/betnsell_architecture_diagram.svg">

### ERD базы данных приложения
<img src="/images/betnsell_database_diagram.svg">

### ERD базы данных блэклиста
<img src="/images/betnsell_blacklist-db.svg">

## Описание поведения при основных сценариях

### Регистрация
Идет проверка на наличие в БД пользователя с указанным юзернеймом/почтой/телефоном [Обязательное подтверждение электронной почты и мобильного телефона] и поиск этих данных в БД блэклиста на случай прошлых блокировок => в случае удачной проверки в БД добавляется новый пользователь с указанными данными, иначе => ошибка.
### Аутентификация 
Проверка входных данных пользователя. [Обязательная двухфакторная аутентификация] и проверка на статус заблокированного аккаунта или ip адреса. При удачном исходе => выдача access and refresh токенов.
### Редактирования профиля
Возможность добавления/изменения аватара пользователя, имени, почты и телефона
### Пополнение баланса 
Через сторонний сервис (предварительно GameMoney) идет обработка данных платежа => при удачной аутентификации в БД обновляется информация о текущем балансе пользователя.
### Создание лота 
Пользователь вводит данные о товаре => в БД создается объект лота и товара. Сервер на основе алгоритма, основанного на криптографии и кэшировании ЗАРАНЕЕ вычисляет выигрышную ячейку и хэширует ее, при этом возвращает ее в response => front'end отображает данный хэш на протяжении всего розыгрыша. 
### Покупка билетов лота 
Пользователь выбирает n кол-во билетов (в зависимости от текущего баланса со стороны front'a не дастся возможность выбрать больше) => обновляются таблицы БД, с баланса покупателей снимается указанная сумма кредитов  и обновляются данные на frontend.
### Окончание лота 
Сервер определяет победителя и начисляет ему на баланс стоимость товара в у.е. Обновляется статус лота и победитель и устанавливается дата закрытия лота (дата, до которой создатель должен отправить товар, иначе будет забанен и лот будет отменен*)
### Блокировка профиля 
При нарушении правил платформы в базу данных блэклиста вносятся: ip адрес сессии пользователя, e-mail и телефон пользователя что блокирует аутентификацию и регистрацию по этим данным, из БД удаляется пользователь а также все слоты, размещенные им(всем участникам возвращаются затраченные ресурсы), во всех аукционах, в которых участвовал данный пользователь, идет освобождение ячеек, приобретенных заблокированным пользователем
### *Отмена лота 
Возникает при несвоевременной отправке товара победителю. Банится создатель лота и возвращаются у.е. всем участникам.
