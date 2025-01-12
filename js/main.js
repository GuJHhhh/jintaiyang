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

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const batteryId = urlParams.get('id');
    console.log('当前电池ID:', batteryId);

    // 获取所有电池信息和图片元素
    const batteryInfos = document.querySelectorAll('.battery-info');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // 根据ID显示对应内容
    if (batteryId) {
        console.log('显示指定电池信息:', batteryId);
        batteryInfos.forEach(info => {
            if (info.getAttribute('data-id') === batteryId) {
                info.style.display = 'block';
                console.log('显示电池信息:', info.getAttribute('data-id'));
            } else {
                info.style.display = 'none';
            }
        });

        galleryItems.forEach(item => {
            if (item.getAttribute('data-id') === batteryId) {
                item.style.display = 'block';
                console.log('显示电池图片:', item.getAttribute('data-id'));
            } else {
                item.style.display = 'none';
            }
        });
    } else {
        console.log('显示所有电池信息');
        batteryInfos.forEach(info => info.style.display = 'block');
        galleryItems.forEach(item => item.style.display = 'block');
    }

    // 初始化滑动功能
    initializeSliders();
});

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
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.onerror = () => {
            img.src = 'images/placeholder.jpg';
            img.alt = '图片加载失败';
        };
        img.loading = 'lazy';
        img.decoding = 'async';
    });
});
