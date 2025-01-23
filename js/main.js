// 页面初始化和工具函数
function initPage() {
    console.log('页面环境信息：', {
        userAgent: navigator.userAgent,
        url: window.location.href,
        search: window.location.search,
        hash: window.location.hash
    });

    // 检查URL中的id参数
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id');
    if (idFromUrl) {
        const codeInput = document.getElementById('codeInput');
        if (codeInput) {
            codeInput.value = idFromUrl;
            // 如果数据库中有这个编码，就显示信息
            if (mockDatabase[idFromUrl]) {
                updateVerifyInfo(mockDatabase[idFromUrl]);
            } else {
                showError('未找到相关产品信息');
            }
        }
    }
}

// 添加扫码功能
function initQRCodeScanner() {
    console.log('Initializing QR scanner...');
    // 检查是否支持 getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('浏览器不支持 getUserMedia API');
        alert('您的浏览器不支持摄像头功能，请使用现代浏览器或确保使用 HTTPS 访问');
        return;
    }

    const scanButton = document.querySelector('.scan-btn');
    if (!scanButton) {
        console.error('找不到扫码按钮');
        return;
    }

    const scannerOverlay = document.querySelector('.scanner-overlay');
    const closeButton = document.querySelector('.close-scanner');
    const video = document.getElementById('scanner-video');
    let scanning = false;
    
    scanButton.addEventListener('click', async () => {
        console.log('Scan button clicked');
        console.log('当前协议:', window.location.protocol);
        scannerOverlay.style.display = 'flex';
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            console.log('Camera access granted');
            
            video.srcObject = stream;
            await video.play();
            scanning = true;
            
            function scan() {
                if (!scanning) return;
                
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                
                if (code) {
                    // 扫描成功
                    scanning = false;
                    stream.getTracks().forEach(track => track.stop());
                    scannerOverlay.style.display = 'none';
                    handleQRCode(code.data);
                } else {
                    requestAnimationFrame(scan);
                }
            }
            
            requestAnimationFrame(scan);
            
        } catch (error) {
            console.error('扫码出错:', error);
            alert('无法访问摄像头，请确保已授予权限');
        }
    });
    
    closeButton.addEventListener('click', () => {
        scanning = false;
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        scannerOverlay.style.display = 'none';
    });
}

// 模拟数据库数据
const mockDatabase = {
    'V894C4M27AB017638F': {
        code: 'V894C4M27AB017638F',          // 防伪编码
        brand: '超威电池',                    // 品牌信息
        isAuthentic: true,                    // 是否正品
        model: 'G-FM-22Pro',                  // 产品型号
        dealerCode: 'ZJ-CX-2024001',         // 经销商编码
        warrantyDate: '2025-12-31'           // 质保日期
    },
    'V894C4M27AB017639F': {
        code: 'V894C4M27AB017639F',
        brand: '超威电池',
        isAuthentic: true,
        model: '石墨烯电池-Pro',
        dealerCode: 'ZJ-CX-2024002',
        warrantyDate: '2025-12-31'
    },
    'V894C4M27AB017640F': {
        code: 'V894C4M27AB017640F',
        brand: '超威电池',
        isAuthentic: true,
        model: '超能黑金版',
        dealerCode: 'ZJ-CX-2024003',
        warrantyDate: '2025-12-31'
    }
};

// 处理扫描到的二维码
function handleQRCode(data) {
    try {
        // 1. 尝试直接匹配防伪码
        if (mockDatabase[data]) {
            updateVerifyInfo(mockDatabase[data]);
            return;
        }

        // 2. 尝试从URL中提取防伪码
        const url = new URL(data);
        const code = url.searchParams.get('code');
        if (code && mockDatabase[code]) {
            updateVerifyInfo(mockDatabase[code]);
            return;
        }

        // 3. 如果都没匹配到，显示错误信息
        showError('未找到相关产品信息');
    } catch (e) {
        console.error('处理二维码数据失败:', e);
        showError('无效的二维码格式');
    }
}

// 更新验证信息显示
function updateVerifyInfo(data) {
    // 更新防伪编码输入框
    const codeInput = document.getElementById('codeInput');
    if (codeInput) {
        codeInput.value = data.code;
    }

    // 更新验证项信息
    const verifyItems = document.querySelectorAll('.verify-item');
    const verifyData = [
        data.code,                // 防伪编码
        data.brand,              // 品牌信息
        data.isAuthentic ? '正品' : '非正品', // 是否正品
        data.model,              // 产品型号
        data.dealerCode,         // 经销商编码
        data.warrantyDate        // 质保日期
    ];

    verifyItems.forEach((item, index) => {
        const valueSpan = item.querySelector('.value');
        if (valueSpan) {
            valueSpan.textContent = verifyData[index] || '-';
        }
    });

    // 添加验证成功的视觉反馈
    if (data.isAuthentic) {
        verifyItems.forEach(item => {
            item.classList.add('verified');
            setTimeout(() => item.classList.remove('verified'), 2000);
        });
    }
}

// 显示错误信息
function showError(message) {
    const verifyItems = document.querySelectorAll('.verify-item');
    verifyItems.forEach(item => {
        item.classList.add('error');
        const valueSpan = item.querySelector('.value');
        if (valueSpan) {
            valueSpan.textContent = message;
        }
        setTimeout(() => {
            item.classList.remove('error');
            const valueSpan = item.querySelector('.value');
            if (valueSpan) {
                valueSpan.textContent = '';
            }
        }, 2000);
    });
}

// 手动输入防伪码验证
document.addEventListener('DOMContentLoaded', function() {
    const codeInput = document.getElementById('codeInput');
    
    // 处理输入事件
    codeInput.addEventListener('input', function(e) {
        const code = e.target.value.trim();
        // 实时更新信息
        if (mockDatabase[code]) {
            updateVerifyInfo(mockDatabase[code]);
            // 更新URL，但不刷新页面
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('id', code);
            window.history.pushState({}, '', newUrl);
        } else if (code.length > 0) {
            showError('未找到相关产品信息');
        }
    });

    // 处理粘贴事件
    codeInput.addEventListener('paste', function(e) {
        setTimeout(() => {
            const code = e.target.value.trim();
            if (mockDatabase[code]) {
                updateVerifyInfo(mockDatabase[code]);
            } else if (code.length > 0) {
                showError('未找到相关产品信息');
            }
        }, 0);
    });

    // 如果URL中有code参数，自动填充
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get('code');
    if (codeFromUrl && mockDatabase[codeFromUrl]) {
        codeInput.value = codeFromUrl;
        updateVerifyInfo(mockDatabase[codeFromUrl]);
    }
});

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initPage();
    initQRCodeScanner();
});
