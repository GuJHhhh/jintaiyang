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
};

// 添加获取URL参数的函数
function getUrlParameter(name) {
    // 针对微信浏览器和其他移动端浏览器的特殊处理
    let url = window.location.href;
    let search = '';
    
    // 检查是否是移动端浏览器
    let isMobile = /Mobile|Android|iPhone/i.test(navigator.userAgent);
    
    if (isMobile) {
        // 移动端：直接从完整URL中获取参数
        let questionMarkIndex = url.indexOf('?');
        if (questionMarkIndex > -1) {
            search = url.substring(questionMarkIndex);
        }
    } else {
        // PC端：使用 location.search
        search = window.location.search;
    }
    
    // 使用 URLSearchParams 解析参数
    const urlParams = new URLSearchParams(search);
    return urlParams.get(name);
}

// 初始化函数
document.addEventListener('DOMContentLoaded', () => {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const batteryId = urlParams.get('id');
    console.log('当前电池ID:', batteryId);

    // 获取所有电池信息和图片元素
    const batteryInfos = document.querySelectorAll('.battery-info');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (batteryId) {
        console.log('显示指定电池信息:', batteryId);
        // 显示对应的电池信息
        batteryInfos.forEach(info => {
            const infoId = info.getAttribute('data-id');
            info.style.display = infoId === batteryId ? 'block' : 'none';
        });

        // 显示对应的电池图片
        galleryItems.forEach(item => {
            const itemId = item.getAttribute('data-id');
            item.style.display = itemId === batteryId ? 'block' : 'none';
        });
    } else {
        console.log('显示所有电池信息');
        // 显示所有电池信息和图片
        batteryInfos.forEach(info => info.style.display = 'block');
        galleryItems.forEach(item => item.style.display = 'block');
    }

    // 初始化其他功能
    initializeSliders();
    addTouchFeedback();
    addScrollAnimations();
});

// 显示单个电池信息
function displayBatteryInfo(batteryId) {
    const battery = batteryData[batteryId];
    const batteryInfos = document.querySelectorAll('.battery-info');
    
    batteryInfos.forEach(info => {
        if (info.getAttribute('data-id') === batteryId) {
            info.style.display = 'block';
        } else {
            info.style.display = 'none';
        }
    });
}

// 显示所有电池信息
function displayAllBatteries() {
    const batteryInfos = document.querySelectorAll('.battery-info');
    batteryInfos.forEach(info => {
        info.style.display = 'block';
    });
}

// 初始化滑动组件
function initializeSliders() {
    const sliders = document.querySelectorAll('.gallery-slider, .company-slider');
    
    sliders.forEach(slider => {
        // 允许水平滚动
        slider.style.overflowX = 'auto';
        slider.style.overflowY = 'hidden';
        slider.style.webkitOverflowScrolling = 'touch';
        
        // 添加触摸事件处理
        let startX;
        let scrollLeft;

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        }, { passive: true });

        slider.addEventListener('touchmove', (e) => {
            if (!startX) return;
            const x = e.touches[0].pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        }, { passive: true });

        slider.addEventListener('touchend', () => {
            startX = null;
        }, { passive: true });
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
        }, { passive: true });

        element.addEventListener('touchend', () => {
            element.style.transform = 'scale(1)';
        }, { passive: true });
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
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        handleImageError(img);
        img.loading = 'lazy';
        img.decoding = 'async';
    });
}); 