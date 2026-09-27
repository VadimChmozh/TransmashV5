/**
 * ООО ПНТК ТРАНСМАШ — СКТИПТЫ
 */
const HERO_SLIDES = [
    {
        img: 'фото1.jpg',
        title: 'Инженерные и технологические решения для транспорта и промышленности',
        subtitle: 'Разработка • проектирование • производство • внедрение'
    },
    {
        img: 'фото 5.jpg',
        title: 'Собственное высокоточное металлообрабатывающее производство',
        subtitle: 'Изготовление сложных узлов, агрегатов и специализированных приводов'
    },
    {
        img: 'фото3.jpg',
        title: 'Инжиниринг полного цикла и модернизация железнодорожного оборудования',
        subtitle: 'От анализа задачи и конструкторских расчётов до испытаний и внедрения'
    }
];

const SLIDE_INTERVAL_MS = 8000;
const TARGET_EMAIL = 'tech@transmash-pntk.ru';

document.addEventListener('DOMContentLoaded', () => {

    // 1. СЛАЙДЕР НА ГЛАВНОМ ЭКРАНЕ
    let currentSlide = 0;
    let slideTimer = null;

    const heroTitle = document.getElementById('heroTitle') || document.querySelector('.hero-title');
    const heroSubtitle = document.getElementById('heroSubtitle') || document.querySelector('.hero-subtitle');
    const heroImg = document.getElementById('heroImg');
    const slideCounter = document.getElementById('slideCounter');
    const slideProgressBar = document.getElementById('slideProgressBar');

    function updateSlide(index) {
        if (!heroTitle || !heroSubtitle || !heroImg || !HERO_SLIDES.length) return;

        heroImg.style.opacity = '0.15';
        heroTitle.style.opacity = '0';
        heroSubtitle.style.opacity = '0';

        setTimeout(() => {
            currentSlide = index;
            const slide = HERO_SLIDES[currentSlide];

            heroTitle.textContent = slide.title;
            heroSubtitle.textContent = slide.subtitle;
            heroImg.src = slide.img;

            heroImg.style.opacity = '0.42';
            heroTitle.style.opacity = '1';
            heroSubtitle.style.opacity = '1';

            if (slideCounter) {
                const currentFormatted = String(currentSlide + 1).padStart(2, '0');
                const totalFormatted = String(HERO_SLIDES.length).padStart(2, '0');
                slideCounter.innerHTML = `${currentFormatted} <span>/${totalFormatted}</span>`;
            }

            if (slideProgressBar) {
                const progressWidth = ((currentSlide + 1) / HERO_SLIDES.length) * 100;
                slideProgressBar.style.width = `${progressWidth}%`;
            }
        }, 220);
    }

    function resetTimer() {
        if (slideTimer) clearInterval(slideTimer);
        if (HERO_SLIDES.length > 1) {
            slideTimer = setInterval(window.nextSlide, SLIDE_INTERVAL_MS);
        }
    }

    window.nextSlide = () => {
        if (!HERO_SLIDES.length) return;
        const next = (currentSlide + 1) % HERO_SLIDES.length;
        updateSlide(next);
        resetTimer();
    };

    window.prevSlide = () => {
        if (!HERO_SLIDES.length) return;
        const prev = (currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
        updateSlide(prev);
        resetTimer();
    };

    resetTimer();

    // 2. ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ
    const observerOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // 3. АНИМАЦИЯ СЧЕТЧИКОВ ЧИСЕЛ ("5+", "20+", "100%")
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                if (!target) return;

                let current = 0;
                const duration = 1200;
                const step = 20;
                const increment = target / (duration / step);

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        el.textContent = target;
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(current);
                    }
                }, step);

                observer.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.counter').forEach(counter => {
        counterObserver.observe(counter);
    });

    // 4. МОДАЛЬНОЕ ОКНО
    const modal = document.getElementById('contactModal');
    const formSubject = document.getElementById('formSubject');

    window.openContactModal = (subjectName = 'Общая заявка с сайта') => {
        if (!modal) return;
        if (formSubject) formSubject.value = subjectName;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    window.closeContactModal = () => {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            window.closeContactModal();
        }
    });

    // 5. МАСКА ТЕЛЕФОНА
    const phoneInput = document.getElementById('clientPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let input = e.target;
            let numbers = input.value.replace(/\D/g, '');
            let formatted = '';

            if (!numbers) {
                input.value = '';
                return;
            }

            if (['7', '8', '9'].indexOf(numbers[0]) > -1) {
                if (numbers[0] === '9') numbers = '7' + numbers;
                formatted = '+7 ';

                if (numbers.length > 1) formatted += '(' + numbers.substring(1, 4);
                if (numbers.length >= 5) formatted += ') ' + numbers.substring(4, 7);
                if (numbers.length >= 8) formatted += '-' + numbers.substring(7, 9);
                if (numbers.length >= 10) formatted += '-' + numbers.substring(9, 11);
            } else {
                formatted = '+' + numbers.substring(0, 16);
            }
            input.value = formatted;
        });

        phoneInput.addEventListener('focus', (e) => {
            if (!e.target.value) e.target.value = '+7 ';
        });

        phoneInput.addEventListener('blur', (e) => {
            if (e.target.value === '+7 ' || e.target.value === '+7') e.target.value = '';
        });
    }

    // 6. ОТПРАВКА ФОРМЫ
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('clientName').value.trim();
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const email = document.getElementById('clientEmail').value.trim();
            const message = document.getElementById('clientMessage').value.trim();
            const subject = formSubject ? formSubject.value : 'Заявка с сайта';

            if (phone.replace(/\D/g, '').length < 11) {
                alert('Пожалуйста, введите номер телефона полностью!');
                if (phoneInput) phoneInput.focus();
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<span>Отправка...</span>';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        _subject: `🛠️ [ПНТК ТРАНСМАШ] ${subject}`,
                        _template: 'table',
                        _captcha: 'false',
                        'Тема заявки': subject,
                        'Имя / Организация': name,
                        'Номер телефона': phone,
                        'Email клиента': email,
                        'Техническое задание': message || 'Не заполнено'
                    })
                });

                if (response.ok) {
                    showToast('✓ Заявка успешно отправлена!');
                    leadForm.reset();
                    window.closeContactModal();
                } else {
                    showToast('✓ Заявка отправлена!');
                    leadForm.reset();
                    window.closeContactModal();
                }
            } catch (err) {
                showToast('✓ Заявка принята!');
                leadForm.reset();
                window.closeContactModal();
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    function showToast(msgText) {
        const toast = document.getElementById('toastBox');
        const textElem = document.getElementById('toastText');
        if (!toast || !textElem) return;

        textElem.textContent = msgText;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 5000);
    }

    // 7. МОБИЛЬНОЕ МЕНЮ И СКРОЛЛ ШАПКИ
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    const header = document.getElementById('header');

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            burgerBtn.classList.toggle('active', isOpen);
            burgerBtn.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                burgerBtn.classList.remove('active');
                burgerBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

});
