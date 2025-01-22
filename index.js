// 添加扫码功能
function initQRCodeScanner() {
    console.log('Initializing QR scanner...');
    const scanButton = document.querySelector('.scan-btn');
    const scannerOverlay = document.querySelector('.scanner-overlay');
    const closeButton = document.querySelector('.close-scanner');
    const video = document.getElementById('scanner-video');
    let scanning = false;
    
    scanButton.addEventListener('click', async () => {
        console.log('Scan button clicked');
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
    
    // 处理扫描到的二维码
    function handleQRCode(data) {
        try {
            const qrData = JSON.parse(data);
            if (qrData.id) {
                // 如果是产品二维码，显示对应的产品信息
                const productSection = document.querySelector(`.battery-info[data-id="${qrData.id}"]`);
                if (productSection) {
                    productSection.scrollIntoView({ behavior: 'smooth' });
                    productSection.classList.add('highlight');
                    setTimeout(() => productSection.classList.remove('highlight'), 2000);
                }
            }
        } catch (e) {
            // 如果不是JSON格式，可能是普通链接
            if (data.startsWith('http')) {
                window.open(data, '_blank');
            } else {
                alert('扫描结果: ' + data);
            }
        }
    }
}

// 初始化扫码功能
initQRCodeScanner(); 