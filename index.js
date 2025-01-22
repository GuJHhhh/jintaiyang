// 添加扫码功能
function initQRCodeScanner() {
    const scanButton = document.querySelector('.scan-btn');
    
    scanButton.addEventListener('click', async () => {
        try {
            // 请求摄像头权限
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            
            // 创建视频元素
            const videoElement = document.createElement('video');
            const scannerContainer = document.createElement('div');
            scannerContainer.className = 'scanner-container';
            
            videoElement.srcObject = stream;
            scannerContainer.appendChild(videoElement);
            document.body.appendChild(scannerContainer);
            
            // 开始视频播放
            await videoElement.play();
            
            // 使用jsQR库进行扫描
            function scan() {
                const canvas = document.createElement('canvas');
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(videoElement, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                
                if (code) {
                    // 扫描成功，处理结果
                    alert('扫描结果: ' + code.data);
                    stream.getTracks().forEach(track => track.stop());
                    scannerContainer.remove();
                } else {
                    // 继续扫描
                    requestAnimationFrame(scan);
                }
            }
            
            requestAnimationFrame(scan);
            
        } catch (error) {
            console.error('扫码出错:', error);
            alert('无法访问摄像头，请确保已授予权限');
        }
    });
}

// 初始化扫码功能
initQRCodeScanner(); 