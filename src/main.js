import './style.css'

const menuButton = document.querySelector('.menu-toggle')
const navigation = document.querySelector('#navigation')

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false')
  menuButton.setAttribute('aria-label', '메뉴 열기')
  navigation.classList.remove('is-open')
}

menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true'
  menuButton.setAttribute('aria-expanded', String(expanded))
  menuButton.setAttribute('aria-label', expanded ? '메뉴 닫기' : '메뉴 열기')
  navigation.classList.toggle('is-open', expanded)
})

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu()
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu()
    menuButton.focus()
  }
})

document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu()
})

window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu)

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const revealElements = document.querySelectorAll('[data-reveal]')

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })

  revealElements.forEach((element) => {
    revealObserver.observe(element)
    element.classList.add('will-reveal')
  })
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) {
      revealElements.forEach((element) => element.classList.add('is-visible'))
      revealObserver.disconnect()
    }
  })
}

const navigationLinks = [...navigation.querySelectorAll('a')]
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      navigationLinks.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      })
    })
  }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 })

  document.querySelectorAll('main > section[id]').forEach((section) => sectionObserver.observe(section))
}
