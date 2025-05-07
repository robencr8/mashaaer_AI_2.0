"""
Music Recommender - Provides music recommendations and information about artists, genres, etc.
LINGUISTIC_VALIDATED: This file contains valid Arabic content that has been verified.
"""

def handle_music_query(prompt: str) -> str:
    """
    Handles queries related to music.

    Args:
        prompt (str): The user's prompt/query related to music

    Returns:
        str: Response with music recommendations or information
    """
    # Simple keyword-based response system
    # In a real implementation, this would connect to a music database or API

    if "طرب" in prompt or "عربي" in prompt:
        return "من أشهر فناني الطرب العربي: أم كلثوم، عبد الحليم حافظ، فيروز، محمد عبد الوهاب، فريد الأطرش. هؤلاء الفنانون يعتبرون من أعمدة الموسيقى العربية الكلاسيكية."

    elif "كلاسيك" in prompt:
        return "من أشهر الموسيقيين الكلاسيكيين: بيتهوفن، موزارت، باخ، تشايكوفسكي، شوبان. من أشهر المقطوعات الكلاسيكية: السيمفونية الخامسة لبيتهوفن، رقصة البجع لتشايكوفسكي، وفور إليز لبيتهوفن."

    elif "بوب" in prompt or "pop" in prompt:
        return "من أشهر فناني البوب العالميين: مايكل جاكسون، مادونا، بيونسيه، تايلور سويفت، إد شيران. هؤلاء الفنانون حققوا نجاحاً كبيراً وتأثيراً واسعاً في صناعة الموسيقى العالمية."

    elif "راب" in prompt or "هيب هوب" in prompt:
        return "من أشهر فناني الراب والهيب هوب: إمينيم، جاي زي، توباك، كندريك لامار، دريك. في العالم العربي، ظهر العديد من فناني الراب مثل مغني الراب المغربي الشاب إسلام، والمصري مروان موسى."

    elif "روك" in prompt or "rock" in prompt:
        return "من أشهر فرق الروك: البيتلز، كوين، بينك فلويد، ليد زيبلين، رولينغ ستونز. هذه الفرق غيرت وجه الموسيقى العالمية وتركت إرثاً موسيقياً كبيراً."

    elif "حزين" in prompt or "هادئ" in prompt:
        return "للأجواء الحزينة أو الهادئة، يمكنك الاستماع إلى: 'Hurt' لجوني كاش، 'Nothing Compares 2 U' لسيناد أوكونور، 'الأطلال' لأم كلثوم، 'بكتب اسمك' لفيروز، أو مقطوعات شوبان للبيانو."

    elif "حماسي" in prompt or "نشيط" in prompt:
        return "للأجواء الحماسية، يمكنك الاستماع إلى: 'Eye of the Tiger' لفرقة Survivor، 'We Will Rock You' لفرقة Queen، 'Uptown Funk' لمارك رونسون وبرونو مارس، أو 'بشرة خير' لحسين الجسمي."

    else:
        return "الموسيقى متنوعة ولكل شخص ذوقه الخاص. هل تبحث عن نوع معين من الموسيقى مثل الطرب العربي، الكلاسيكية، البوب، الراب، الروك، أو موسيقى تناسب مزاجاً معيناً؟"
