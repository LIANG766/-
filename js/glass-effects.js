// 高级玻璃效果和液态动画系统
class GlassEffects {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.glassElements = [];
        this.liquidElements = [];
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.createGlassEffects();
        this.createLiquidEffects();
        this.initAdvancedAnimations();
        this.startAnimationLoop();
        this.isInitialized = true;
    }
    
    bindEvents() {
        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });
        
        // 设备倾斜事件（移动端）
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                const x = (e.gamma || 0) / 90; // -1 到 1
                const y = (e.beta || 0) / 90;  // -1 到 1
                
                this.targetX = (x + 1) * window.innerWidth / 2;
                this.targetY = (y + 1) * window.innerHeight / 2;
            });
        }
        
        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.updateGlassEffects();
        });
    }
    
    createGlassEffects() {
        // 为所有玻璃卡片添加高级效果
        const glassCards = document.querySelectorAll('.glass-card');
        
        glassCards.forEach((card, index) => {
            this.enhanceGlassCard(card, index);
        });
        
        // 为导航栏添加特殊效果
        const nav = document.querySelector('.glass-nav');
        if (nav) {
            this.enhanceNavigation(nav);
        }
        
        // 为按钮添加液态效果
        const buttons = document.querySelectorAll('.glass-btn');
        buttons.forEach(btn => this.enhanceLiquidButton(btn));
    }
    
    enhanceGlassCard(card, index) {
        // 创建多层玻璃效果
        const layers = this.createGlassLayers(card);
        
        // 添加鼠标移动视差效果
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            this.updateCardEffect(card, layers, x, y);
        });
        
        card.addEventListener('mouseleave', () => {
            this.resetCardEffect(card, layers);
        });
        
        // 添加到管理列表
        this.glassElements.push({
            element: card,
            layers: layers,
            index: index
        });
    }
    
    createGlassLayers(card) {
        const layers = {};
        
        // 创建光线反射层
        const reflection = document.createElement('div');
        reflection.className = 'glass-reflection';
        reflection.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
            border-radius: inherit;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 1;
        `;
        
        // 创建彩虹折射层
        const refraction = document.createElement('div');
        refraction.className = 'glass-refraction';
        refraction.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, 
                rgba(255,0,150,0.1) 0%, 
                rgba(0,204,255,0.1) 25%, 
                rgba(255,255,0,0.1) 50%, 
                rgba(255,0,150,0.1) 75%, 
                rgba(0,204,255,0.1) 100%);
            border-radius: inherit;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 2;
        `;
        
        // 创建动态高光层
        const highlight = document.createElement('div');
        highlight.className = 'glass-highlight';
        highlight.style.cssText = `
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: inherit;
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
            z-index: 3;
        `;
        
        card.style.position = 'relative';
        card.appendChild(reflection);
        card.appendChild(refraction);
        card.appendChild(highlight);
        
        layers.reflection = reflection;
        layers.refraction = refraction;
        layers.highlight = highlight;
        
        return layers;
    }
    
    updateCardEffect(card, layers, x, y) {
        // 计算3D变换
        const rotateX = (y - 0.5) * 10;
        const rotateY = (x - 0.5) * -10;
        const translateZ = Math.abs(x - 0.5) + Math.abs(y - 0.5);
        
        // 应用3D变换
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(${translateZ * 20}px)
            scale(1.02)
        `;
        
        // 更新反射层
        layers.reflection.style.opacity = '0.6';
        layers.reflection.style.background = `
            linear-gradient(${135 + rotateY * 2}deg, 
                rgba(255,255,255,0.2) 0%, 
                transparent 50%)
        `;
        
        // 更新折射层
        layers.refraction.style.opacity = '0.3';
        layers.refraction.style.transform = `translate(${x * 10 - 5}px, ${y * 10 - 5}px)`;
        
        // 更新高光层
        layers.highlight.style.opacity = '0.4';
        layers.highlight.style.transform = `translate(${x * 20 - 10}px, ${y * 20 - 10}px)`;
    }
    
    resetCardEffect(card, layers) {
        card.style.transform = '';
        layers.reflection.style.opacity = '0';
        layers.refraction.style.opacity = '0';
        layers.highlight.style.opacity = '0';
    }
    
    enhanceNavigation(nav) {
        // 添加动态模糊效果
        let scrollY = 0;
        
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
            const blur = Math.min(scrollY / 10, 20);
            nav.style.backdropFilter = `blur(${20 + blur}px)`;
            nav.style.background = `rgba(255, 255, 255, ${0.08 + scrollY / 5000})`;
        });
        
        // 添加呼吸效果
        this.createBreathingEffect(nav);
    }
    
    createBreathingEffect(element) {
        let phase = 0;
        
        const animate = () => {
            phase += 0.02;
            const scale = 1 + Math.sin(phase) * 0.002;
            const opacity = 0.08 + Math.sin(phase * 0.5) * 0.02;
            
            element.style.transform = `translateX(-50%) scale(${scale})`;
            element.style.background = `rgba(255, 255, 255, ${opacity})`;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    enhanceLiquidButton(button) {
        // 创建液态波纹效果
        button.addEventListener('click', (e) => {
            this.createRippleEffect(button, e);
        });
        
        // 添加悬停液态效果
        button.addEventListener('mouseenter', () => {
            this.startLiquidHover(button);
        });
        
        button.addEventListener('mouseleave', () => {
            this.stopLiquidHover(button);
        });
    }
    
    createRippleEffect(button, event) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: ${y}px;
            left: ${x}px;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        // 添加波纹动画
        if (!document.querySelector('#ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'ripple-keyframes';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    startLiquidHover(button) {
        const originalBg = button.style.background;
        
        button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        button.style.background = `
            linear-gradient(45deg, 
                rgba(102, 126, 234, 0.4), 
                rgba(118, 75, 162, 0.4),
                rgba(240, 147, 251, 0.4))
        `;
        button.style.backgroundSize = '200% 200%';
        button.style.animation = 'gradientFlow 2s ease infinite';
        
        // 添加液态流动动画
        if (!document.querySelector('#gradient-flow-keyframes')) {
            const style = document.createElement('style');
            style.id = 'gradient-flow-keyframes';
            style.textContent = `
                @keyframes gradientFlow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    stopLiquidHover(button) {
        button.style.animation = '';
        button.style.background = '';
        button.style.backgroundSize = '';
    }
    
    createLiquidEffects() {
        // 为头像添加液态边框
        const avatar = document.querySelector('.avatar');
        if (avatar) {
            this.createLiquidAvatar(avatar);
        }
        
        // 为技能进度条添加液态效果
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => this.enhanceProgressBar(bar));
    }
    
    createLiquidAvatar(avatar) {
        const container = avatar.parentElement;
        const ring = container.querySelector('.avatar-ring');
        
        if (ring) {
            // 创建多层液态效果
            let phase = 0;
            
            const animate = () => {
                phase += 0.01;
                
                // 创建波浪形边框
                const path = this.generateWavePath(phase);
                ring.style.clipPath = `polygon(${path})`;
                
                // 动态颜色变化
                const hue1 = 220 + Math.sin(phase) * 20;
                const hue2 = 280 + Math.cos(phase * 0.7) * 30;
                
                ring.style.background = `
                    linear-gradient(${phase * 50}deg, 
                        hsl(${hue1}, 70%, 60%) 0%,
                        hsl(${hue2}, 80%, 70%) 50%,
                        hsl(${hue1 + 40}, 60%, 80%) 100%)
                `;
                
                requestAnimationFrame(animate);
            };
            
            animate();
        }
    }
    
    generateWavePath(phase) {
        const points = [];
        const numPoints = 20;
        
        for (let i = 0; i <= numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const baseRadius = 50;
            const waveAmplitude = 2;
            const waveFreq = 5;
            
            const radius = baseRadius + Math.sin(angle * waveFreq + phase * 3) * waveAmplitude;
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;
            
            points.push(`${x}% ${y}%`);
        }
        
        return points.join(', ');
    }
    
    enhanceProgressBar(bar) {
        // 添加液态流动效果
        const flow = document.createElement('div');
        flow.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(255,255,255,0.4) 50%, 
                transparent 100%);
            border-radius: inherit;
            animation: flowEffect 2s ease-in-out infinite;
            transform: translateX(-100%);
        `;
        
        bar.style.position = 'relative';
        bar.style.overflow = 'hidden';
        bar.appendChild(flow);
        
        // 添加流动动画
        if (!document.querySelector('#flow-effect-keyframes')) {
            const style = document.createElement('style');
            style.id = 'flow-effect-keyframes';
            style.textContent = `
                @keyframes flowEffect {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    initAdvancedAnimations() {
        // 添加页面进入动画
        this.addPageEnterAnimations();
        
        // 添加滚动视差效果
        this.addParallaxEffects();
        
        // 添加鼠标跟随效果
        this.addMouseFollowEffects();
    }
    
    addPageEnterAnimations() {
        const sections = document.querySelectorAll('.section');
        
        sections.forEach((section, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateSection(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(section);
        });
    }
    
    animateSection(section) {
        const elements = section.querySelectorAll('.glass-card, .hero-title, .section-title');
        
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }
    
    addParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.glass-card');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            parallaxElements.forEach((el, index) => {
                const speed = 0.1 + (index % 3) * 0.05;
                const yPos = -(scrollY * speed);
                
                el.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        });
    }
    
    addMouseFollowEffects() {
        const cursor = this.createCustomCursor();
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // 鼠标进入交互元素时的效果
        const interactiveElements = document.querySelectorAll('.glass-btn, .nav-link, .glass-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.background = 'rgba(102, 126, 234, 0.3)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'rgba(255, 255, 255, 0.2)';
            });
        });
    }
    
    createCustomCursor() {
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.2s ease, background 0.2s ease;
            backdrop-filter: blur(10px);
            transform: translate(-50%, -50%);
        `;
        
        return cursor;
    }
    
    startAnimationLoop() {
        const animate = () => {
            // 平滑鼠标跟随
            this.mouseX += (this.targetX - this.mouseX) * 0.1;
            this.mouseY += (this.targetY - this.mouseY) * 0.1;
            
            // 更新全局效果
            this.updateGlobalEffects();
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    updateGlobalEffects() {
        // 更新粒子系统鼠标位置
        if (window.particleSystem) {
            window.particleSystem.mouseX = this.mouseX;
            window.particleSystem.mouseY = this.mouseY;
        }
        
        // 更新玻璃元素的全局效果
        this.glassElements.forEach(({ element, layers, index }) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(this.mouseX - centerX, 2) + 
                Math.pow(this.mouseY - centerY, 2)
            );
            
            // 全局发光效果
            if (distance < 200) {
                const intensity = (200 - distance) / 200;
                element.style.boxShadow = `
                    0 8px 32px rgba(0, 0, 0, 0.1),
                    0 0 ${intensity * 50}px rgba(102, 126, 234, ${intensity * 0.3}),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `;
            } else {
                element.style.boxShadow = '';
            }
        });
    }
    
    updateGlassEffects() {
        // 响应式更新
        this.glassElements.forEach(({ element, layers }) => {
            this.resetCardEffect(element, layers);
        });
    }
    
    destroy() {
        // 清理资源
        this.glassElements = [];
        this.liquidElements = [];
        this.isInitialized = false;
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.glassEffects = new GlassEffects();
});