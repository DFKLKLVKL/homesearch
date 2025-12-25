document.addEventListener('DOMContentLoaded', function() {
    // Данные пользователя
    const userData = {
        id: 1,
        name: "Иван Иванов",
        email: "ivan@example.com",
        phone: "+7 (999) 123-45-67"
    };

    // Имитация базы данных объектов
    let userProperties = JSON.parse(localStorage.getItem('userProperties') || '[]');
    
    // Элементы DOM
    const propertiesGrid = document.getElementById('propertiesGrid');
    const noProperties = document.getElementById('noProperties');
    const addPropertyBtn = document.getElementById('addPropertyBtn');
    const addFirstBtn = document.getElementById('addFirstBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const addPropertyModal = document.getElementById('addPropertyModal');
    const modalClose = document.getElementById('modalClose');
    const propertyForm = document.getElementById('propertyForm');
    const floatingAddBtn = document.getElementById('floatingAddBtn');
    
    // Статистика
    const totalProperties = document.getElementById('totalProperties');
    const activeProperties = document.getElementById('activeProperties');
    const totalEarnings = document.getElementById('totalEarnings');
    const avgRating = document.getElementById('avgRating');
    
    // Фильтры
    const filterTabs = document.querySelectorAll('.filter_tab');
    const searchTrackingInput = document.querySelector('.search_tracking_input');
    
    // Шаги формы
    const steps = document.querySelectorAll('.form_step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const stepDots = document.querySelectorAll('.step_dot');
    
    let currentStep = 1;
    let selectedFiles = [];

    // Инициализация
    init();
    
    function init() {
        loadProperties();
        updateStats();
        setupEventListeners();
        setupFormValidation();
    }
    
    function loadProperties() {
        if (userProperties.length === 0) {
            propertiesGrid.style.display = 'none';
            noProperties.style.display = 'block';
            return;
        }
        
        propertiesGrid.style.display = 'grid';
        noProperties.style.display = 'none';
        
        renderProperties();
    }
    
    function renderProperties(filteredProperties = userProperties) {
        propertiesGrid.innerHTML = '';
        
        filteredProperties.forEach(property => {
            const propertyCard = createPropertyCard(property);
            propertiesGrid.appendChild(propertyCard);
        });
        
        // Анимация появления
        setTimeout(() => {
            document.querySelectorAll('.property_card').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        }, 100);
    }
    
    // Обновленная функция createPropertyCard с исправленными иконками
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property_card';
    card.dataset.id = property.id;
    
    // Определяем иконку статуса
    let statusIcon, statusClass, statusText;
    switch(property.status) {
        case 'active':
            statusIcon = '✅';
            statusClass = 'status_active';
            statusText = 'Активно';
            break;
        case 'pending':
            statusIcon = '⏳';
            statusClass = 'status_pending';
            statusText = 'На рассмотрении';
            break;
        case 'rejected':
            statusIcon = '❌';
            statusClass = 'status_rejected';
            statusText = 'Отклонено';
            break;
        case 'archived':
            statusIcon = '📁';
            statusClass = 'status_archived';
            statusText = 'В архиве';
            break;
        default:
            statusIcon = '❓';
            statusClass = 'status_unknown';
            statusText = 'Неизвестно';
    }
    
    // Определяем иконку типа
    let typeIcon, typeText;
    switch(property.type) {
        case 'apartment':
            typeIcon = '🏠';
            typeText = 'Квартира';
            break;
        case 'house':
            typeIcon = '🏡';
            typeText = 'Дом';
            break;
        case 'cottage':
            typeIcon = '🌲';
            typeText = 'Коттедж';
            break;
        case 'hotel':
            typeIcon = '🏨';
            typeText = 'Отель';
            break;
        case 'studio':
            typeIcon = '🏢';
            typeText = 'Студия';
            break;
        case 'room':
            typeIcon = '🚪';
            typeText = 'Комната';
            break;
        default:
            typeIcon = '🏘️';
            typeText = 'Другое';
    }
    
    // Форматируем цену
    const formattedPrice = formatPrice(property.price);
    
    // Создаем карточку с исправленными кнопками
    card.innerHTML = `
        <div class="property_image">
            <img src="${property.images[0] || 'img/default-property.jpg'}" alt="${property.title}">
            <div class="property_status ${statusClass}">
                ${statusIcon} ${statusText}
            </div>
            <div class="property_type_badge">
                ${typeIcon} ${typeText}
            </div>
        </div>
        
        <div class="property_info">
            <div class="property_header">
                <h3 class="property_title">${property.title}</h3>
                <div class="property_rating">
                    <span class="stars">${generateStars(property.rating || 0)}</span>
                    <span class="rating_count">(${property.reviews || 0})</span>
                </div>
            </div>
            
            <div class="property_location">
                <span class="location_icon">📍</span>
                ${property.city}, ${property.address}
            </div>
            
            <div class="property_features">
                <span class="feature">👥 ${property.guests} гост.</span>
                <span class="feature">🛏️ ${property.bedrooms} сп.</span>
                <span class="feature">🚿 ${property.bathrooms} ван.</span>
            </div>
            
            <div class="property_meta">
                <div class="property_price">
                    ${formattedPrice} <span>/ сутки</span>
                </div>
                <div class="property_meta_info">
                    <span class="meta_item">Добавлено: ${formatDate(property.createdAt)}</span>
                    <span class="meta_item">Просмотры: ${property.views || 0}</span>
                </div>
            </div>
            
            <div class="property_actions">
                <button class="action_btn edit_btn" data-action="edit">
                    <span class="action_icon">✏️</span> 
                    <span class="action_text">Редактировать</span>
                </button>
                <button class="action_btn stats_btn" data-action="stats">
                    <span class="action_icon">📊</span>
                    <span class="action_text">Статистика</span>
                </button>
                <button class="action_btn ${property.status === 'active' ? 'pause_btn' : 'activate_btn'}" 
                        data-action="${property.status === 'active' ? 'pause' : 'activate'}">
                    <span class="action_icon">${property.status === 'active' ? '⏸️' : '▶️'}</span>
                    <span class="action_text">${property.status === 'active' ? 'Приостановить' : 'Активировать'}</span>
                </button>
            </div>
        </div>
    `;
    
    // Добавляем обработчики событий для кнопок
    const buttons = card.querySelectorAll('.action_btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const propertyId = parseInt(card.dataset.id);
            handlePropertyAction(action, propertyId);
        });
    });
    
    return card;
}

// Функция для обработки действий с объектом
function handlePropertyAction(action, propertyId) {
    const property = userProperties.find(p => p.id === propertyId);
    if (!property) return;
    
    switch(action) {
        case 'edit':
            editProperty(propertyId);
            break;
        case 'stats':
            showPropertyStats(propertyId);
            break;
        case 'pause':
            pauseProperty(propertyId);
            break;
        case 'activate':
            activateProperty(propertyId);
            break;
    }
}

// Функции для работы с объектами
function editProperty(propertyId) {
    showNotification('Функция редактирования в разработке', 'info');
    // Здесь можно добавить логику редактирования
}

function showPropertyStats(propertyId) {
    const property = userProperties.find(p => p.id === propertyId);
    if (!property) return;
    
    const statsHtml = `
        <h3>Статистика: ${property.title}</h3>
        <div class="stats_details">
            <div class="stat_item">
                <span class="stat_label">Просмотры:</span>
                <span class="stat_value">${property.views || 0}</span>
            </div>
            <div class="stat_item">
                <span class="stat_label">Бронирования:</span>
                <span class="stat_value">${property.bookings || 0}</span>
            </div>
            <div class="stat_item">
                <span class="stat_label">Доход:</span>
                <span class="stat_value">${formatPrice(property.price * (property.bookings || 0))}</span>
            </div>
            <div class="stat_item">
                <span class="stat_label">Рейтинг:</span>
                <span class="stat_value">${property.rating || 0}/5 ⭐</span>
            </div>
        </div>
    `;
    
    showNotification(statsHtml, 'info');
}

function pauseProperty(propertyId) {
    const index = userProperties.findIndex(p => p.id === propertyId);
    if (index !== -1) {
        userProperties[index].status = 'archived';
        localStorage.setItem('userProperties', JSON.stringify(userProperties));
        loadProperties();
        updateStats();
        showNotification('Объект приостановлен', 'success');
    }
}

function activateProperty(propertyId) {
    const index = userProperties.findIndex(p => p.id === propertyId);
    if (index !== -1) {
        userProperties[index].status = 'active';
        localStorage.setItem('userProperties', JSON.stringify(userProperties));
        loadProperties();
        updateStats();
        showNotification('Объект активирован', 'success');
    }
}

// Обновленная функция showNotification для отображения HTML
function showNotification(message, type = 'info') {
    // Удаляем предыдущие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    if (typeof message === 'string') {
        notification.textContent = message;
    } else {
        notification.innerHTML = message;
    }
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Добавьте эти стили в конец файла CSS

    
    function updateStats() {
        const total = userProperties.length;
        const active = userProperties.filter(p => p.status === 'active').length;
        
        // Рассчитываем доход (импровизируем)
        let earnings = 0;
        userProperties.forEach(property => {
            if (property.status === 'active') {
                earnings += property.price * (property.bookings || 0);
            }
        });
        
        // Рассчитываем средний рейтинг
        let totalRating = 0;
        let ratedProperties = 0;
        userProperties.forEach(property => {
            if (property.rating) {
                totalRating += property.rating;
                ratedProperties++;
            }
        });
        const avg = ratedProperties > 0 ? (totalRating / ratedProperties).toFixed(1) : '0.0';
        
        // Обновляем UI
        totalProperties.textContent = total;
        activeProperties.textContent = active;
        totalEarnings.textContent = formatPrice(earnings);
        avgRating.textContent = avg;
    }
    
    function setupEventListeners() {
        // Кнопки добавления
        addPropertyBtn.addEventListener('click', openModal);
        addFirstBtn.addEventListener('click', openModal);
        floatingAddBtn.addEventListener('click', openModal);
        
        // Закрытие модального окна
        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
        
        // Фильтрация
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.dataset.filter;
                filterProperties(filter);
            });
        });
        
        // Поиск
        searchTrackingInput.addEventListener('input', debounceSearch);
        
        // Навигация по шагам формы
        prevBtn.addEventListener('click', goToPrevStep);
        nextBtn.addEventListener('click', goToNextStep);
        
        // Загрузка фотографий
        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('photoUpload').click();
        });
        
        const photoUpload = document.getElementById('photoUpload');
        photoUpload.addEventListener('change', handleFileSelect);
        
        // Drag and drop для фотографий
        const uploadArea = document.getElementById('photoUploadArea');
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleFileDrop);
        
        // Счетчик символов в описании
        const descriptionInput = document.getElementById('propertyDescription');
        const charCount = document.getElementById('charCount');
        descriptionInput.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
        
        // Селекторы чисел
        document.querySelectorAll('.number_plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('.number_input');
                const max = parseInt(input.max);
                let value = parseInt(input.value);
                if (value < max) {
                    input.value = value + 1;
                }
            });
        });
        
        document.querySelectorAll('.number_minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('.number_input');
                const min = parseInt(input.min);
                let value = parseInt(input.value);
                if (value > min) {
                    input.value = value - 1;
                }
            });
        });
        
        // Подсказки цены
        document.querySelectorAll('.price_suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', function() {
                const price = this.dataset.price;
                document.getElementById('propertyPrice').value = price;
            });
        });
        
        // Отправка формы
        propertyForm.addEventListener('submit', handleFormSubmit);
        
        // Выход из профиля
        const logoutBtn = document.getElementById('logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Вы уверены, что хотите выйти?')) {
                    window.location.href = 'index.html';
                }
            });
        }
    }
    
    function setupFormValidation() {
        // Проверка перед переходом к следующему шагу
        nextBtn.addEventListener('click', function() {
            if (!validateCurrentStep()) {
                return;
            }
        });
    }
    
    function validateCurrentStep() {
        const step = document.getElementById(`step${currentStep}`);
        const inputs = step.querySelectorAll('[required]');
        
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                showInputError(input, 'Это поле обязательно для заполнения');
            } else {
                clearInputError(input);
            }
        });
        
        // Особые проверки для каждого шага
        switch(currentStep) {
            case 1:
                const description = document.getElementById('propertyDescription');
                if (description.value.length < 100) {
                    isValid = false;
                    showInputError(description, 'Описание должно содержать минимум 100 символов');
                }
                break;
            case 2:
                if (selectedFiles.length < 2) {
                    isValid = false;
                    showNotification('Необходимо загрузить минимум 2 фотографии', 'error');
                }
                break;
            case 3:
                const price = document.getElementById('propertyPrice');
                if (price.value < 100 || price.value > 1000000) {
                    isValid = false;
                    showInputError(price, 'Цена должна быть от 100 до 1 000 000 ₽');
                }
                break;
        }
        
        return isValid;
    }
    
    function showInputError(input, message) {
        const formGroup = input.closest('.form_group');
        let errorElement = formGroup.querySelector('.form_error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form_error';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.classList.add('error');
        
        // Автоматическое скрытие ошибки
        input.addEventListener('input', function clearError() {
            this.classList.remove('error');
            if (errorElement) {
                errorElement.remove();
            }
            this.removeEventListener('input', clearError);
        }, { once: true });
    }
    
    function clearInputError(input) {
        input.classList.remove('error');
        const errorElement = input.closest('.form_group')?.querySelector('.form_error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function openModal() {
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        resetForm();
    }
    
    function closeModal() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
        resetForm();
    }
    
    function resetForm() {
        currentStep = 1;
        selectedFiles = [];
        updateStepNavigation();
        propertyForm.reset();
        document.getElementById('photosPreview').innerHTML = '';
        document.getElementById('photosCount').textContent = '0';
        document.getElementById('charCount').textContent = '0';
    }
    
    function goToPrevStep() {
        if (currentStep > 1) {
            currentStep--;
            updateStepNavigation();
        }
    }
    
    function goToNextStep() {
        if (currentStep < 4) {
            currentStep++;
            updateStepNavigation();
        }
    }
    
    function updateStepNavigation() {
        // Показываем/скрываем шаги
        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === currentStep);
        });
        
        // Обновляем точки индикатора
        stepDots.forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === currentStep);
        });
        
        // Обновляем кнопки навигации
        prevBtn.disabled = currentStep === 1;
        
        if (currentStep === 4) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
            updatePreview();
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }
    
    function updatePreview() {
        const preview = document.getElementById('previewSummary');
        const formData = new FormData(propertyForm);
        
        preview.innerHTML = `
            <h4>Сводка:</h4>
            <div class="preview_item">
                <strong>${formData.get('title')}</strong>
            </div>
            <div class="preview_item">
                ${getTypeText(formData.get('type'))} · ${formData.get('city')}
            </div>
            <div class="preview_item">
                👥 ${formData.get('guests')} гостей · 🛏️ ${formData.get('bedrooms')} спальни
            </div>
            <div class="preview_item">
                💰 ${formatPrice(formData.get('price'))} / сутки
            </div>
            <div class="preview_item">
                📸 ${selectedFiles.length} фотографий
            </div>
        `;
    }
    
    function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        handleFiles(files);
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    }
    
    function handleFileDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    }
    
    function handleFiles(files) {
        // Фильтруем только изображения
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        // Проверяем лимит
        if (selectedFiles.length + imageFiles.length > 5) {
            showNotification('Можно загрузить максимум 5 фотографий', 'error');
            return;
        }
        
        // Добавляем файлы
        imageFiles.forEach(file => {
            if (selectedFiles.length < 5) {
                selectedFiles.push(file);
                createImagePreview(file);
            }
        });
        
        // Обновляем счетчик
        document.getElementById('photosCount').textContent = selectedFiles.length;
    }
    
    function createImagePreview(file) {
        const reader = new FileReader();
        const photosPreview = document.getElementById('photosPreview');
        
        reader.onload = function(e) {
            const preview = document.createElement('div');
            preview.className = 'photo_preview';
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Превью">
                <button type="button" class="remove_photo" data-file="${file.name}">×</button>
            `;
            
            photosPreview.appendChild(preview);
            
            // Удаление фотографии
            const removeBtn = preview.querySelector('.remove_photo');
            removeBtn.addEventListener('click', function() {
                const fileName = this.dataset.file;
                selectedFiles = selectedFiles.filter(f => f.name !== fileName);
                preview.remove();
                document.getElementById('photosCount').textContent = selectedFiles.length;
            });
        };
        
        reader.readAsDataURL(file);
    }
    
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateCurrentStep()) {
            return;
        }
        
        if (selectedFiles.length < 2) {
            showNotification('Необходимо загрузить минимум 2 фотографии', 'error');
            return;
        }
        
        // Показываем индикатор загрузки
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Публикация...';
        submitBtn.disabled = true;
        
        try {
            // Имитация загрузки фотографий
            const imageUrls = await uploadImages();
            
            // Собираем данные формы
            const formData = new FormData(propertyForm);
            const amenities = Array.from(formData.getAll('amenities'));
            
            // Создаем новый объект
            const newProperty = {
                id: Date.now(),
                title: formData.get('title'),
                type: formData.get('type'),
                guests: parseInt(formData.get('guests')),
                bedrooms: parseInt(formData.get('bedrooms')),
                bathrooms: parseInt(formData.get('bathrooms')),
                description: formData.get('description'),
                country: formData.get('country'),
                city: formData.get('city'),
                address: formData.get('address'),
                zip: formData.get('zip'),
                price: parseInt(formData.get('price')),
                discount: parseInt(formData.get('discount')),
                amenities: amenities,
                rules: formData.get('rules'),
                check_in: formData.get('check_in'),
                check_out: formData.get('check_out'),
                images: imageUrls,
                status: 'pending',
                createdAt: new Date().toISOString(),
                views: 0,
                bookings: 0,
                rating: 0,
                reviews: 0
            };
            
            // Добавляем в массив и сохраняем
            userProperties.unshift(newProperty);
            localStorage.setItem('userProperties', JSON.stringify(userProperties));
            
            // Показываем уведомление
            showNotification('Объект успешно добавлен!', 'success');
            
            // Закрываем модальное окно
            setTimeout(() => {
                closeModal();
                loadProperties();
                updateStats();
            }, 1500);
            
        } catch (error) {
            console.error('Ошибка при добавлении объекта:', error);
            showNotification('Произошла ошибка при добавлении объекта', 'error');
        } finally {
            // Восстанавливаем кнопку
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Опубликовать';
            submitBtn.disabled = false;
        }
    }
    
    function uploadImages() {
        // Имитация загрузки фотографий на сервер
        return new Promise((resolve) => {
            setTimeout(() => {
                const imageUrls = selectedFiles.map((_, index) => 
                    `img/property-${Date.now()}-${index}.jpg`
                );
                resolve(imageUrls);
            }, 1000);
        });
    }
    
    function filterProperties(filter) {
        let filtered = userProperties;
        
        if (filter !== 'all') {
            filtered = userProperties.filter(property => property.status === filter);
        }
        
        // Применяем поиск
        const searchTerm = searchTrackingInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(property => 
                property.title.toLowerCase().includes(searchTerm) ||
                property.address.toLowerCase().includes(searchTerm) ||
                property.city.toLowerCase().includes(searchTerm)
            );
        }
        
        renderProperties(filtered);
        
        // Показываем сообщение, если нет результатов
        if (filtered.length === 0) {
            propertiesGrid.innerHTML = `
                <div class="no_results" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
                    <h3 style="color: white; margin-bottom: 10px;">Ничего не найдено</h3>
                    <p style="color: #a0aec0;">Попробуйте изменить критерии поиска</p>
                </div>
            `;
        }
    }
    
    function debounceSearch() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            const activeFilter = document.querySelector('.filter_tab.active').dataset.filter;
            filterProperties(activeFilter);
        }, 300);
    }
    
    // Вспомогательные функции
    function formatPrice(price) {
        return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }
    
    function getTypeText(type) {
        const types = {
            'apartment': 'Квартира',
            'house': 'Дом',
            'cottage': 'Коттедж',
            'hotel': 'Отель',
            'studio': 'Студия',
            'room': 'Комната'
        };
        return types[type] || 'Неизвестно';
    }
    
    function getStatusText(status) {
        const statuses = {
            'active': 'Активно',
            'pending': 'На рассмотрении',
            'rejected': 'Отклонено',
            'archived': 'В архиве'
        };
        return statuses[status] || 'Неизвестно';
    }
    
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '★'.repeat(fullStars);
        if (hasHalfStar) stars += '☆';
        stars += '☆'.repeat(5 - Math.ceil(rating));
        return stars;
    }
    
    function showNotification(message, type = 'info') {
        // Удаляем предыдущие уведомления
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());
        
        // Создаем новое уведомление
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});