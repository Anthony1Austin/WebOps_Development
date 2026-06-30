/**
 * Homepage intro curtain + hero headline reveal (index only).
 */

const INTRO_SESSION_KEY = 'webops-home-intro-seen';

function prefersReducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

function scrollToTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

function lockScrollAtTop() {
    scrollToTop();
    document.body.classList.add('intro-scroll-lock');
}

function unlockScrollAtTop() {
    document.body.classList.remove('intro-scroll-lock');
    scrollToTop();
    requestAnimationFrame(() => {
        scrollToTop();
    });
}

function revealHero(hero) {
    if (!hero) return;
    hero.classList.add('is-revealed');
}

function finishIntro(curtain, hero) {
    unlockScrollAtTop();
    document.body.classList.remove('intro-active');
    document.body.classList.add('intro-complete');
    revealHero(hero);
}

function skipIntro(curtain, hero) {
    curtain?.remove();
    finishIntro(curtain, hero);
}

export function initIntro() {
    const curtain = document.getElementById('intro-curtain');
    const hero = document.querySelector('.hero');

    if (!curtain) return;

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    scrollToTop();
    lockScrollAtTop();

    if (prefersReducedMotion() || sessionStorage.getItem(INTRO_SESSION_KEY)) {
        skipIntro(curtain, hero);
        return;
    }

    sessionStorage.setItem(INTRO_SESSION_KEY, '1');

    const INTRO_HOLD_MS = 1600;
    const INTRO_EXIT_MS = 750;

    window.setTimeout(() => {
        curtain.classList.add('is-exiting');
        finishIntro(curtain, hero);

        window.setTimeout(() => {
            curtain.remove();
            scrollToTop();
        }, INTRO_EXIT_MS);
    }, INTRO_HOLD_MS);
}
