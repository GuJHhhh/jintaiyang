// 在文件顶部添加电池数据配置
const batteryData = {
    '12345': {
        name: '工业级锂电池',
        capacity: '100Ah',
        voltage: '12.8V',
        lifecycle: '>2000次',
        type: '锂电池系列'
    },
    '12346': {
        name: '家用储能电池',
        capacity: '200Ah',
        voltage: '24V',
        lifecycle: '>3000次',
        type: '磷酸铁锂电池'
    }
    // 可以添加更多电池配置
};

document.addEventListener('DOMContentLoaded', () => {
    // 获取并处理URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const batteryId = urlParams.get('id');
    
    const batteryInfoContent = document.querySelector('.battery-info .card-content');
    
    if (batteryId && batteryData[batteryId]) {
        // 如果有指定电池ID，只显示该电池信息
        displayBatteryInfo(batteryId);
    } else if (!batteryId) {
        // 如果没有指定电池ID，显示所有电池信息
        displayAllBatteries();
    } else {
        // 如果电池ID无效，显示错误信息
        showError('未找到该电池信息');
    }
    
    // 原有的初始化代码
    initializeSliders();
    addTouchFeedback();
    addScrollAnimations();
});

// 显示单个电池信息
function displayBatteryInfo(batteryId) {
    const battery = batteryData[batteryId];
    const batteryInfoContent = document.querySelector('.battery-info .card-content');
    
    if (batteryInfoContent) {
        batteryInfoContent.innerHTML = `
            <div class="info-item">
                <h3>${battery.name}</h3>
                <p>类型: ${battery.type}</p>
                <p>容量: ${battery.capacity}</p>
                <p>电压: ${battery.voltage}</p>
                <p>循环寿命: ${battery.lifecycle}</p>
            </div>
        `;
    }
}

// 显示所有电池信息
function displayAllBatteries() {
    const batteryInfoContent = document.querySelector('.battery-info .card-content');
    
    if (batteryInfoContent) {
        batteryInfoContent.innerHTML = `
            <div class="info-item">
                <h3>锂电池系列</h3>
                <p>容量: 100Ah</p>
                <p>电压: 12.8V</p>
                <p>循环寿命: >2000次</p>
            </div>
            <div class="info-item">
                <h3>磷酸铁锂电池</h3>
                <p>容量: 200Ah</p>
                <p>电压: 24V</p>
                <p>循环寿命: >3000次</p>
            </div>
        `;
    }
}

// 添加错误显示函数
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.insertBefore(errorDiv, document.body.firstChild);
}

// 初始化图片滑动组件
function initializeSliders() {
    const sliders = document.querySelectorAll('.gallery-slider, .company-slider');
    
    sliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });

        // 触摸事件支持
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const x = e.touches[0].pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    });
}

// 添加触摸反馈效果
function addTouchFeedback() {
    const cards = document.querySelectorAll('.info-card');
    const links = document.querySelectorAll('.link-item');

    const elements = [...cards, ...links];
    elements.forEach(element => {
        element.addEventListener('touchstart', () => {
            element.style.transform = 'scale(0.98)';
        });

        element.addEventListener('touchend', () => {
            element.style.transform = 'scale(1)';
        });
    });
}

// 添加滚动动画
function addScrollAnimations() {
    const cards = document.querySelectorAll('.info-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
    });
}

// 图片加载错误处理
function handleImageError(img) {
    img.onerror = () => {
        img.src = 'images/placeholder.jpg';
        img.alt = '图片加载失败';
    };
}

// 初始化图片错误处理
const images = document.querySelectorAll('img');
images.forEach(handleImageError); 