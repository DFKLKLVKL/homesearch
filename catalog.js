// catalog.js
document.addEventListener('DOMContentLoaded', function() {
    // Имитация данных из базы данных
    const mockProducts = [
        {
            id: 1,
            title: "Квартира в центре Москвы",
            location: "Москва, Красная площадь",
            image: "img/moscow-apartment.jpg",
            price: 15000,
            guests: 4,
            bedrooms: 2,
            bathrooms: 1,
            rating: 4.8,
            type: "apartment",
            wifi: true,
            parking: true,
            kitchen: true
        },
        {
            id: 2,
            title: "Коттедж в Сочи",
            location: "Сочи, Красная Поляна",
            image: "img/sochi-cottage.jpg",
            price: 45000,
            guests: 8,
            bedrooms: 4,
            bathrooms: 3,
            rating: 4.9,
            type: "cottage",
            wifi: true,
            parking: true,
            kitchen: true,
            pool: true
        },
        {
            id: 3,
            title: "Уютная квартира в Питере",
            location: "Санкт-Петербург, Невский проспект",
            image: "img/spb-apartment.jpg",
            price: 12000,
            guests: 2,
            bedrooms: 1,
            bathrooms: 1,
            rating: 4.5,
            type: "apartment",
            wifi: true,
            kitchen: true
        },
        {
            id: 4,
            title: "Отель у моря в Геленджике",
            location: "Геленджик, набережная",
            image: "img/gelendzhik-hotel.jpg",
            price: 25000,
            guests: 2,
            bedrooms: 1,
            bathrooms: 1,
            rating: 4.7,
            type: "hotel",
            wifi: true,
            parking: true,
            ac: true
        },
        {
            id: 5,
            title: "Загородный дом под Москвой",
            location: "Московская область, Истра",
            image: "img/moscow-house.jpg",
            price: 35000,
            guests: 6,
            bedrooms: 3,
            bathrooms: 2,
            rating: 4.6,
            type: "house",
            wifi: true,
            parking: true,
            kitchen: true
        },
        {
            id: 6,
            title: "Апартаменты в Казани",
            location: "Казань, Кремль",
            image: "img/kazan-apartment.jpg",
            price: 9000,
            guests: 3,
            bedrooms: 1,
            bathrooms: 1,
            rating: 4.4,
            type: "apartment",
            wifi: true,
            kitchen: true
        },
        {
            id: 7,
            title: "Люкс в гостинице Астрахани",
            location: "Астрахань, центр",
            image: "img/astrakhan-hotel.jpg",
            price: 18000,
            guests: 2,
            bedrooms: 1,
            bathrooms: 1,
            rating: 4.3,
            type: "hotel",
            wifi: true,
            ac: true
        },
        {
            id: 8,
            title: "Шале в Домбае",
            location: "Домбай, горнолыжный курорт",
            image: "img/dombai-chalet.jpg",
            price: 65000,
            guests: 10,
            bedrooms: 5,
            bathrooms: 4,
            rating: 4.9,
            type: "cottage",
            wifi: true,
            parking: true,
            kitchen: true,
            pool: true,
            ac: true
        },
        {
            id: 9,
            title: "Студия в Калининграде",
            location: "Калининград, центр",
            image: "img/kaliningrad-studio.jpg",
            price: 7000,
            guests: 2,
            bedrooms: 1,
            bathrooms: 1,
            rating: 4.1,
            type: "apartment",
            wifi: true,
            kitchen: true
        },
        {
            id: 10,
            title: "Вилла в Адлере",
            location: "Адлер, у моря",
            image: "img/adler-villa.jpg",
            price: 85000,
            guests: 12,
            bedrooms: 6,
            bathrooms: 4,
            rating: 4.8,
            type: "cottage",
            wifi: true,
            parking: true,
            kitchen: true,
            pool: true,
            ac: true
        },
        {
            id: 11,
            title: "Бюджетный отель в Екатеринбурге",
            location: "Екатеринбург, центр",
            image: "img/ekb-hotel.jpg",
            price: 5500,
            guests: 2,
            bedrooms: 1,
            bathrooms: 1,
            rating: 3.8,
            type: "hotel",
            wifi: true
        },
        {
            id: 12,
            title: "Пентхаус в Ростове-на-Дону",
            location: "Ростов-на-Дону, набережная",
            image: "img/rostov-penthouse.jpg",
            price: 42000,
            guests: 4,
            bedrooms: 2,
            bathrooms: 2,
            rating: 4.7,
            type: "apartment",
            wifi: true,
            parking: true,
            kitchen: true,
            ac: true
        }
    ];

    // Элементы DOM
    const productsGrid = document.getElementById('products_grid');
    const searchInput = document.getElementById('search_input');
    const typeButtons = document.querySelectorAll('.type_btn');
    const minPrice = document.getElementById('min_price');
    const maxPrice = document.getElementById('max_price');
    const priceMinRange = document.getElementById('price_min');
    const priceMaxRange = document.getElementById('price_max');
    const amenitiesCheckboxes = document.querySelectorAll('.amenity_checkbox input');
    const applyFiltersBtn = document.querySelector('.apply_filters_btn');
    const resetFiltersBtn = document.querySelector('.reset_filters_btn');
    const sortSelect = document.querySelector('.sort_select');
    const totalResults = document.getElementById('total_results');
    const guestMinus = document.querySelector('.guest_btn.minus');
    const guestPlus = document.querySelector('.guest_btn.plus');
    const guestCount = document.querySelector('.guest_count');
    const quickView = document.getElementById('quick_view');
    const closeQuickView = document.querySelector('.close_quick_view');

    // Добавляем элементы для фильтра рейтинга
    const ratingButtons = document.querySelectorAll('.rating_btn');
    
    // Текущие фильтры
    let currentFilters = {
        search: '',
        type: 'all',
        minPrice: 5000,
        maxPrice: 100000,
        guests: 2,
        amenities: ['wifi', 'parking'],
        minRating: 0,
        sortBy: 'popular'
    };

    // Инициализация ценовых диапазонов
    const MIN_PRICE = 1000;
    const MAX_PRICE = 100000;
    const STEP_PRICE = 1000;

    // Инициализация
    initFilters();
    renderProducts();

    // Инициализация фильтров
    function initFilters() {
        // Настройка ценовых слайдеров
        priceMinRange.min = MIN_PRICE;
        priceMinRange.max = MAX_PRICE;
        priceMinRange.step = STEP_PRICE;
        priceMinRange.value = currentFilters.minPrice;
        
        priceMaxRange.min = MIN_PRICE;
        priceMaxRange.max = MAX_PRICE;
        priceMaxRange.step = STEP_PRICE;
        priceMaxRange.value = currentFilters.maxPrice;
        
        minPrice.textContent = formatPrice(currentFilters.minPrice);
        maxPrice.textContent = formatPrice(currentFilters.maxPrice);

        // Обновление цен
        priceMinRange.addEventListener('input', function() {
            const minValue = parseInt(this.value);
            const maxValue = parseInt(priceMaxRange.value);
            
            if (minValue > maxValue - 5000) {
                this.value = maxValue - 5000;
                currentFilters.minPrice = maxValue - 5000;
            } else {
                currentFilters.minPrice = minValue;
            }
            minPrice.textContent = formatPrice(currentFilters.minPrice);
            debounceFilter();
        });

        priceMaxRange.addEventListener('input', function() {
            const maxValue = parseInt(this.value);
            const minValue = parseInt(priceMinRange.value);
            
            if (maxValue < minValue + 5000) {
                this.value = minValue + 5000;
                currentFilters.maxPrice = minValue + 5000;
            } else {
                currentFilters.maxPrice = maxValue;
            }
            maxPrice.textContent = formatPrice(currentFilters.maxPrice);
            debounceFilter();
        });

        // Типы жилья
        typeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                typeButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilters.type = this.dataset.type;
                renderProducts();
            });
        });

        // Фильтр рейтинга
        if (ratingButtons.length > 0) {
            ratingButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    ratingButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentFilters.minRating = parseFloat(this.dataset.rating);
                    renderProducts();
                });
            });
        }

        // Поиск
        searchInput.addEventListener('input', function() {
            currentFilters.search = this.value.toLowerCase();
            debounceSearch();
        });

        // Количество гостей
        guestMinus.addEventListener('click', function() {
            if (currentFilters.guests > 1) {
                currentFilters.guests--;
                guestCount.textContent = currentFilters.guests;
                debounceFilter();
            }
        });

        guestPlus.addEventListener('click', function() {
            if (currentFilters.guests < 10) {
                currentFilters.guests++;
                guestCount.textContent = currentFilters.guests;
                debounceFilter();
            }
        });

        // Удобства
        amenitiesCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const amenityName = this.name;
                if (this.checked) {
                    if (!currentFilters.amenities.includes(amenityName)) {
                        currentFilters.amenities.push(amenityName);
                    }
                } else {
                    currentFilters.amenities = currentFilters.amenities.filter(a => a !== amenityName);
                }
                debounceFilter();
            });
        });

        // Сортировка
        sortSelect.addEventListener('change', function() {
            currentFilters.sortBy = this.value;
            renderProducts();
        });

        // Применить фильтры
        applyFiltersBtn.addEventListener('click', function() {
            renderProducts();
            this.classList.add('applied');
            setTimeout(() => this.classList.remove('applied'), 1000);
        });

        // Сбросить фильтры
        resetFiltersBtn.addEventListener('click', function() {
            currentFilters = {
                search: '',
                type: 'all',
                minPrice: 5000,
                maxPrice: 100000,
                guests: 2,
                amenities: ['wifi', 'parking'],
                minRating: 0,
                sortBy: 'popular'
            };
            
            searchInput.value = '';
            priceMinRange.value = 5000;
            priceMaxRange.value = 100000;
            minPrice.textContent = formatPrice(5000);
            maxPrice.textContent = formatPrice(100000);
            guestCount.textContent = '2';
            
            typeButtons.forEach(b => {
                b.classList.remove('active');
                if (b.dataset.type === 'all') b.classList.add('active');
            });
            
            if (ratingButtons.length > 0) {
                ratingButtons.forEach(b => {
                    b.classList.remove('active');
                    if (b.dataset.rating === '0') b.classList.add('active');
                });
            }
            
            amenitiesCheckboxes.forEach(cb => {
                cb.checked = cb.name === 'wifi' || cb.name === 'parking';
            });
            
            sortSelect.value = 'popular';
            
            renderProducts();
            
            this.classList.add('reset');
            setTimeout(() => this.classList.remove('reset'), 1000);
        });

        // Быстрый просмотр
        closeQuickView.addEventListener('click', function() {
            quickView.classList.remove('active');
        });

        quickView.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });

        // Стилизация выпадающего списка
        styleSelect();
    }

    // Стилизация выпадающего списка
    function styleSelect() {
        const sortSelect = document.querySelector('.sort_select');
        
        // Создаем кастомный контейнер
        const customSelect = document.createElement('div');
        customSelect.className = 'custom-select';
        
        const selectedOption = document.createElement('div');
        selectedOption.className = 'custom-select__selected';
        selectedOption.textContent = sortSelect.options[sortSelect.selectedIndex].text;
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'custom-select__options';
        
        // Создаем кастомные опции
        Array.from(sortSelect.options).forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'custom-select__option';
            optionDiv.textContent = option.text;
            optionDiv.dataset.value = option.value;
            
            if (option.selected) {
                optionDiv.classList.add('selected');
            }
            
            optionDiv.addEventListener('click', function() {
                sortSelect.value = this.dataset.value;
                selectedOption.textContent = this.textContent;
                
                optionsContainer.querySelectorAll('.custom-select__option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
                
                currentFilters.sortBy = this.dataset.value;
                renderProducts();
                
                optionsContainer.style.display = 'none';
            });
            
            optionsContainer.appendChild(optionDiv);
        });
        
        selectedOption.addEventListener('click', function(e) {
            e.stopPropagation();
            optionsContainer.style.display = 
                optionsContainer.style.display === 'block' ? 'none' : 'block';
        });
        
        customSelect.appendChild(selectedOption);
        customSelect.appendChild(optionsContainer);
        
        // Заменяем оригинальный select
        sortSelect.style.display = 'none';
        sortSelect.parentNode.insertBefore(customSelect, sortSelect.nextSibling);
        
        // Закрываем при клике вне селекта
        document.addEventListener('click', function(e) {
            if (!customSelect.contains(e.target)) {
                optionsContainer.style.display = 'none';
            }
        });
    }

    // Debounce для поиска
    let searchTimeout;
    function debounceSearch() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            renderProducts();
        }, 500);
    }

    // Debounce для фильтров
    let filterTimeout;
    function debounceFilter() {
        clearTimeout(filterTimeout);
        filterTimeout = setTimeout(() => {
            renderProducts();
        }, 300);
    }

    // Форматирование цены
    function formatPrice(price) {
        if (price >= 1000000) {
            return (price / 1000000).toFixed(1) + ' млн ₽';
        } else if (price >= 1000) {
            return (price / 1000).toFixed(0) + ' тыс ₽';
        }
        return price.toLocaleString('ru-RU') + ' ₽';
    }

    // Генерация звезд рейтинга
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '★';
            } else if (i === fullStars && hasHalfStar) {
                stars += '★';
            } else {
                stars += '☆';
            }
        }
        
        return `<span class="stars">${stars}</span> <span class="rating_num">${rating.toFixed(1)}</span>`;
    }

    // Открытие быстрого просмотра
    function openQuickView(product) {
        document.getElementById('quick_view_title').textContent = product.title;
        document.getElementById('quick_view_price').textContent = formatPrice(product.price) + ' / ночь';
        document.getElementById('quick_view_desc').textContent = `${product.bedrooms} спальни · ${product.guests} гостей · ${product.bathrooms} ванные`;
        document.getElementById('quick_view_img').src = product.image;
        document.getElementById('quick_view_img').alt = product.title;
        
        quickView.classList.add('active');
    }

    // Рендеринг продуктов
    function renderProducts() {
        // Фильтрация
        let filteredProducts = mockProducts.filter(product => {
            // Поиск
            if (currentFilters.search && 
                !product.title.toLowerCase().includes(currentFilters.search) &&
                !product.location.toLowerCase().includes(currentFilters.search)) {
                return false;
            }
            
            // Тип
            if (currentFilters.type !== 'all' && product.type !== currentFilters.type) {
                return false;
            }
            
            // Цена
            if (product.price < currentFilters.minPrice || product.price > currentFilters.maxPrice) {
                return false;
            }
            
            // Гости
            if (product.guests < currentFilters.guests) {
                return false;
            }
            
            // Рейтинг
            if (product.rating < currentFilters.minRating) {
                return false;
            }
            
            // Удобства
            for (const amenity of currentFilters.amenities) {
                if (!product[amenity]) {
                    return false;
                }
            }
            
            return true;
        });

        // Сортировка
        filteredProducts.sort((a, b) => {
            switch (currentFilters.sortBy) {
                case 'price_low':
                    return a.price - b.price;
                case 'price_high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'new':
                    return b.id - a.id;
                default: // popular
                    return (b.rating * 10 + b.price/10000) - (a.rating * 10 + a.price/10000);
            }
        });

        // Обновление счетчика
        totalResults.textContent = filteredProducts.length;

        // Очистка сетки
        productsGrid.innerHTML = '';

        // Если нет результатов
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h3>Ничего не найдено</h3>
                    <p>Попробуйте изменить параметры поиска или сбросить фильтры</p>
                </div>
            `;
            return;
        }

        // Рендеринг карточек
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product_card';
            productCard.innerHTML = `
                <div class="product_image_container">
                    <img src="${product.image}" alt="${product.title}" class="product_image">
                    <div class="product_type_badge ${product.type}">
                        ${product.type === 'apartment' ? '🏠 Квартира' : 
                          product.type === 'house' ? '🏡 Дом' :
                          product.type === 'hotel' ? '🏨 Отель' : '🏡 Коттедж'}
                    </div>
                </div>
                <div class="product_info">
                    <h3 class="product_title">${product.title}</h3>
                    <div class="product_location">📍 ${product.location}</div>
                    <div class="product_features">
                        <span class="feature">👥 ${product.guests}</span>
                        <span class="feature">🛏️ ${product.bedrooms}</span>
                        <span class="feature">🚿 ${product.bathrooms}</span>
                    </div>
                    <div class="product_rating">
                        ${generateStars(product.rating)}
                    </div>
                    <div class="product_price">
                        <div class="price">
                            ${formatPrice(product.price)} <span>/ ночь</span>
                        </div>
                        <div class="product_actions">
                            <button class="fav_btn" data-id="${product.id}">
                                <span class="fav_icon">🤍</span>
                            </button>
                            <button class="book_btn" data-id="${product.id}">Забронировать</button>
                        </div>
                    </div>
                </div>
            `;

            // Добавляем обработчики
            const favBtn = productCard.querySelector('.fav_btn');
            const bookBtn = productCard.querySelector('.book_btn');

            favBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const icon = this.querySelector('.fav_icon');
                const isFav = icon.textContent === '❤️';
                icon.textContent = isFav ? '🤍' : '❤️';
                this.classList.toggle('active');
                
                // Сохраняем в избранное (можно добавить в localStorage)
                const productId = this.dataset.id;
                let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                
                if (isFav) {
                    favorites = favorites.filter(id => id !== productId);
                } else {
                    favorites.push(productId);
                }
                
                localStorage.setItem('favorites', JSON.stringify(favorites));
            });

            bookBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const productId = this.dataset.id;
                window.location.href = `booking.html?id=${productId}`;
            });

            // Быстрый просмотр по клику на карточку
            productCard.addEventListener('click', function(e) {
                if (!e.target.closest('.product_actions') && !e.target.closest('.fav_btn')) {
                    openQuickView(product);
                }
            });

            productsGrid.appendChild(productCard);
        });
    }

    // Выход из профиля
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Вы уверены, что хотите выйти?')) {
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            }
        });
    }

    // Загрузка больше товаров при прокрутке
    let loading = false;
    window.addEventListener('scroll', function() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        
        if (scrollPosition >= documentHeight - 500 && !loading) {
            loading = true;
            loadMoreProducts();
        }
    });

    // Загрузка дополнительных товаров
    function loadMoreProducts() {
        // Здесь можно добавить AJAX запрос для загрузки больше товаров
        console.log('Загрузка дополнительных товаров...');
        
        // Имитация загрузки
        setTimeout(() => {
            loading = false;
        }, 1000);
    }

    // Загрузка избранных товаров из localStorage
    function loadFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        favorites.forEach(productId => {
            const favBtn = document.querySelector(`.fav_btn[data-id="${productId}"]`);
            if (favBtn) {
                const icon = favBtn.querySelector('.fav_icon');
                icon.textContent = '❤️';
                favBtn.classList.add('active');
            }
        });
    }

    // Вызываем после рендеринга
    setTimeout(loadFavorites, 100);

    console.log('Каталог загружен успешно!');
});