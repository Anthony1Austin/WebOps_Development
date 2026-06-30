/**
 * Homepage intro curtain + hero headline reveal (index only).
 */

const INTRO_SESSION_KEY = 'webops-home-intro-seen';

function prefersReducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

function revealHero(hero) {
    if (!hero) return;
    hero.classList.add('is-revealed');
}

function skipIntro(curtain, hero) {
    curtain?.remove();
    document.body.classList.remove('intro-active');
    document.body.classList.add('intro-complete');
    revealHero(hero);
}

export function initIntro() {
    const curtain = document.getElementById('intro-curtain');
    const hero = document.querySelector('.hero');

    if (!curtain) return;

    if (prefersReducedMotion() || sessionStorage.getItem(INTRO_SESSION_KEY)) {
        skipIntro(curtain, hero);
        return;
    }

    sessionStorage.setItem(INTRO_SESSION_KEY, '1');

    const INTRO_HOLD_MS = 1600;
    const INTRO_EXIT_MS = 750;

    window.setTimeout(() => {
        curtain.classList.add('is-exiting');
        document.body.classList.remove('intro-active');
        document.body.classList.add('intro-complete');
        revealHero(hero);

        window.setTimeout(() => {
            curtain.remove();
        }, INTRO_EXIT_MS);
    }, INTRO_HOLD_MS);
}
