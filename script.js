const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
            const modal = document.getElementById('portfolio-modal');
            function openModal(data) {
            document.getElementById('modal-title').innerText = data.title;
            const mainImg = document.getElementById('modal-main-img');
            mainImg.src = data.images[0];
            mainImg.dataset.images = JSON.stringify(data.images);
            
            // Скрываем или показываем стрелки в зависимости от кол-ва фото
            const leftBtn = document.getElementById('button-left');
            const rightBtn = document.getElementById('button-right');
            
            if (data.images.length <= 1) {
                leftBtn.style.display = 'none';
                rightBtn.style.display = 'none';
            } else {
                leftBtn.style.display = 'block';
                rightBtn.style.display = 'block';
            }

            const featuresList = document.getElementById('modal-features');
            featuresList.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
            
            const worksList = document.getElementById('modal-works');
            worksList.innerHTML = data.works.map(w => `<li>${w}</li>`).join('');

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

            function closeModal() {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            // Click Outside (Закрытие при клике на фон)
            window.onclick = function(event) {
                if (event.target == modal) closeModal();
            }

            // Закрытие на Esc
            window.onkeydown = function(e) {
                if (e.key === "Escape") closeModal();
            }
            function NextImg(dir) {
            const img = document.getElementById('modal-main-img');
            const images = JSON.parse(img.dataset.images);
            const currentSrc = img.src;

            const getCurrentIndex = () => {
                const currentFile = currentSrc.split('/').pop();
                return images.findIndex(path => path.split('/').pop() === currentFile);
            };

            const currentIndex = getCurrentIndex();
            if (currentIndex === -1) return;

            let newIndex;
            if (dir === 'left' && currentIndex > 0) {
                newIndex = currentIndex - 1;
            } else if (dir === 'right' && currentIndex < images.length - 1) {
                newIndex = currentIndex + 1;
            } else {
                return;
            }

            // --- Добавленная логика анимации ---
            // 1. Удаляем класс, если он уже был (чтобы сбросить анимацию)
            img.classList.remove('image-fade');
            
            // 2. Форсируем "перерисовку" (reflow), чтобы браузер заметил удаление класса
            void img.offsetWidth; 
            
            // 3. Меняем путь к картинке
            img.src = images[newIndex];
            
            // 4. Добавляем класс анимации заново
            img.classList.add('image-fade');
        }
            function scrollPortfolio(direction) {
            const container = document.querySelector('.portfolio-carousel');
            const scrollAmount = 360; // Ширина карточки (330) + gap (30)

            if (direction === 'left') {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
            const burger = document.getElementById('burger');
            const nav = document.getElementById('nav');

            burger.addEventListener('click', () => {
                nav.classList.toggle('active'); // Открываем меню
                burger.classList.toggle('open'); // Превращаем полоски в крестик
                
                // Блокируем скролл страницы при открытом меню
                if (nav.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = 'auto';
                }
            });

            // Закрываем меню при клике на любую ссылку
            const navLinks = document.querySelectorAll('.nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    burger.classList.remove('open');
                    document.body.style.overflow = 'auto';
                });
            });
            const typeSelect = document.getElementById('repair-type');
            const areaInput = document.getElementById('area');
            const areaRange = document.getElementById('area-range');
            const extraCheckboxes = document.querySelectorAll('.extra-option');
            const totalPriceElement = document.getElementById('total-price');

            function calculate() {
                const basePrice = parseInt(typeSelect.value);
                const area = parseFloat(areaInput.value) || 0;
                
                let extraPrice = 0;
                extraCheckboxes.forEach(cb => {
                    if (cb.checked) {
                        extraPrice += parseInt(cb.value);
                    }
                });

                const total = area * (basePrice + extraPrice);
                
                // Красивая анимация цифр
                animateValue(totalPriceElement, parseInt(totalPriceElement.innerText.replace(/\s/g, '')), total, 500);
            }

            // Связка инпута и ползунка
            areaInput.addEventListener('input', () => {
                areaRange.value = areaInput.value;
                calculate();
            });

            areaRange.addEventListener('input', () => {
                areaInput.value = areaRange.value;
                calculate();
            });

            typeSelect.addEventListener('change', calculate);
            extraCheckboxes.forEach(cb => cb.addEventListener('change', calculate));

            // Функция для плавного счета цифр
            function animateValue(obj, start, end, duration) {
                let startTimestamp = null;
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    const value = Math.floor(progress * (end - start) + start);
                    obj.innerHTML = value.toLocaleString('ru-RU');
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    }
                };
                window.requestAnimationFrame(step);
            }

            // Начальный расчет
            calculate();
