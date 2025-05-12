import React from 'react'

const AgreementPageBuilder = () => {
  return (
    <div className="container mx-auto p-6">
  <h1 className="text-3xl font-bold mb-6">Пользовательское Соглашение для ticketFlow</h1>
  
  <div className="space-y-4">
    <div className="bg-gray-50 p-4 rounded-lg dark:bg-neutral-900">
      <h2 className="text-xl font-semibold mb-2">1. Общие положения</h2>
      <p>1.1. Сервис ticketFlow (далее - "Сервис") предоставляет платформу для онлайн-бронирования билетов на мероприятия с использованием технологий реального времени (WebSocket).</p>
    </div>
    <div className="bg-gray-50 p-4 rounded-lg dark:bg-neutral-900">
      <h2 className="text-xl font-semibold mb-2">2. Процесс бронирования</h2>
      <p>2.1. Выбранные места блокируются на 15 минут. Если оплата не произведена в течение этого времени, бронь автоматически отменяется.</p>
      <p>2.2. При занятости места вы можете встать в очередь. Система уведомит вас при освобождении места через WebSocket-соединение.</p>
    </div>
    <div className="bg-gray-50 p-4 rounded-lg dark:bg-neutral-900">
      <h2 className="text-xl font-semibold mb-2">3. Финансовые условия</h2>
      <p>3.1. Полная стоимость билета должна быть оплачена в течение 15 минут после бронирования.</p>
      <p>3.2. Возврат средств возможен за 24 часа до мероприятия через личный кабинет.</p>
    </div>
    <div className="bg-gray-50 p-4 rounded-lg dark:bg-neutral-900">
      <h2 className="text-xl font-semibold mb-2">4. Ответственность</h2>
      <p>4.1. Сервис не несет ответственности за:</p>
      <ul className="list-disc pl-6">
        <li>Технические сбои в работе WebSocket-соединения</li>
        <li>Изменения в программе мероприятия организаторами</li>
        <li>Потерю данных при использовании очереди Redis</li>
      </ul>
    </div>
    <div className="bg-gray-50 p-4 rounded-lg dark:bg-neutral-900">
      <h2 className="text-xl font-semibold mb-2">5. Технические требования</h2>
      <p>5.1. Для корректной работы требуется:</p>
      <ul className="list-disc pl-6">
        <li>Поддержка WebSocket в браузере</li>
        <li>Отключение блокировщиков WebSocket-соединений</li>
        <li>Стабильное интернет-соединение</li>
      </ul>
    </div>
    <div className="bg-gray-50 p-4 rounded-lg dark:bg-neutral-900">
      <h2 className="text-xl font-semibold mb-2">6. Конфиденциальность</h2>
      <p>6.1. Данные платежных карт обрабатываются через PCI DSS сертифицированные шлюзы и не хранятся в наших системах.</p>
      <p>6.2. Логи работы с очередями Redis хранятся 30 дней для аудита.</p>
    </div>

    <div className="mt-6 text-sm text-gray-500">
      <p>Дата вступления в силу: 15 апреля 2025</p>
      <p>Контакты: support@ticketflow.io | +7 (775) 630-64-01</p>
    </div>
  </div>
</div>
  )
}

export default AgreementPageBuilder