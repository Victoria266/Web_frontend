import segno
import base64
from io import BytesIO


def generate_report_qr(order, items, time):
    # Формируем информацию для QR-кода
    info = f"Отчет №{order.id}\n\n"

    for item in items:
        info += f"\t{item.resource.name} (Плановый обьем: {item.volume}) (Реальный обьем: {item.plan_volume})\n"

    completed_at_str = time.strftime('%Y-%m-%d %H:%M:%S')
    info += f"Дата и время списания: {completed_at_str}"

    # Генерация QR-кода
    qr = segno.make(info)
    buffer = BytesIO()
    qr.save(buffer, kind='png')
    buffer.seek(0)

    # Конвертация изображения в base64
    qr_image_base64 = base64.b64encode(buffer.read()).decode('utf-8')

    return qr_image_base64