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

// 获取URL参数的函数
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

// 显示电池信息和图片的函数
function showBatteryContent() {
    const batteryId = getUrlParameter('id');
    console.log('当前电池ID:', batteryId);

    // 获取所有电池信息和图片元素
    const batteryInfos = document.querySelectorAll('.battery-info');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!batteryId) {
        // 如果没有ID参数，显示所有内容
        console.log('显示所有电池信息');
        batteryInfos.forEach(info => info.style.display = 'block');
        galleryItems.forEach(item => item.style.display = 'block');
        return;
    }

    // 如果有ID参数，只显示对应的内容
    console.log('显示指定电池信息:', batteryId);
    
    // 显示对应的电池信息
    batteryInfos.forEach(info => {
        const infoId = info.getAttribute('data-id');
        if (infoId === batteryId) {
            info.style.display = 'block';
            info.classList.add('show');
            console.log('显示电池信息:', infoId);
        } else {
            info.style.display = 'none';
            info.classList.remove('show');
        }
    });

    // 显示对应的电池图片
    galleryItems.forEach(item => {
        const itemId = item.getAttribute('data-id');
        if (itemId === batteryId) {
            item.style.display = 'block';
            console.log('显示电池图片:', itemId);
        } else {
            item.style.display = 'none';
        }
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 显示电池信息和图片
    showBatteryContent();
    
    // 初始化滑动功能
    initializeSliders();
});

// 确保在所有资源加载完成后也执行一次
window.addEventListener('load', showBatteryContent);

// 初始化滑动组件
function initializeSliders() {
    const sliders = document.querySelectorAll('.gallery-slider, .company-slider');
    
    sliders.forEach(slider => {
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

// 图片加载错误处理
const images = document.querySelectorAll('img');
images.forEach(img => {
    img.onerror = () => {
        img.src = 'images/placeholder.jpg';
        img.alt = '图片加载失败';
    };
    img.loading = 'lazy';
    img.decoding = 'async';
});
