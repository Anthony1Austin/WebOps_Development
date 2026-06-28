/**
 * FAQ accordion — lightweight, no library defaults
 */

export function initFaq() {
    const faq = document.getElementById('faq');
    if (!faq) return;

    const items = faq.querySelectorAll('.faq__item');

    items.forEach((item) => {
        const trigger = item.querySelector('.faq__question');
        const panel = item.querySelector('.faq__answer');
        if (!trigger || !panel) return;

        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            items.forEach((other) => {
                other.classList.remove('is-open');
                const otherTrigger = other.querySelector('.faq__question');
                const otherPanel = other.querySelector('.faq__answer');
                if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                if (otherPanel) otherPanel.hidden = true;
            });

            if (!isOpen) {
                item.classList.add('is-open');
                trigger.setAttribute('aria-expanded', 'true');
                panel.hidden = false;
            }
        });
    });
}
