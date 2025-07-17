// 导航系统
class Navigation {
    constructor() {
        this.currentSection = 'home';
        this.sections = ['home', 'about', 'skills', 'projects', 'contact'];
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sectionElements = document.querySelectorAll('.section');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initProgressBars();
        this.initIntersectionObserver();
        this.addKeyboardNavigation();
    }
    
    bindEvents() {
        // 导航链接点击
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('data-section');
                this.navigateToSection(targetSection);
                
                // 移动端关闭菜单
                if (window.innerWidth <= 768) {
                    this.closeMenu();
                }
            });
        });
        
        // 移动端菜单切换
        this.navToggle.addEventListener('click', () => {
            this.toggleMenu();
        });
        
        // 点击页面其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.glass-nav')) {
                this.closeMenu();
            }
        });
        
        // 滚动事件
        window.addEventListener('wheel', (e) => {
            if (this.isAnimating) return;
            
            const direction = e.deltaY > 0 ? 1 : -1;
            this.navigateByScroll(direction);
        }, { passive: false });
        
        // 触摸事件处理
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            const deltaY = touchStartY - touchEndY;
            
            if (Math.abs(deltaY) > 50 && !this.isAnimating) {
                const direction = deltaY > 0 ? 1 : -1;
                this.navigateByScroll(direction);
            }
        });
        
        // 按钮事件
        this.bindButtonEvents();
    }
    
    bindButtonEvents() {
        // 首页按钮
        const learnMoreBtn = document.querySelector('.hero-buttons .primary');
        const viewWorksBtn = document.querySelector('.hero-buttons .secondary');
        
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                this.navigateToSection('about');
            });
        }
        
        if (viewWorksBtn) {
            viewWorksBtn.addEventListener('click', () => {
                this.navigateToSection('projects');
            });
        }
        
        // 项目按钮
        const projectBtns = document.querySelectorAll('.project-btn');
        projectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.showProjectModal();
            });
        });
        
        // 表单提交
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(e);
            });
        }
    }
    
    navigateToSection(sectionId) {
        if (this.isAnimating || this.currentSection === sectionId) return;
        
        this.isAnimating = true;
        const currentEl = document.getElementById(this.currentSection);
        const targetEl = document.getElementById(sectionId);
        
        // 更新导航状态
        this.updateNavigation(sectionId);
        
        // 页面切换动画
        this.animateTransition(currentEl, targetEl, () => {
            this.currentSection = sectionId;
            this.isAnimating = false;
            
            // 如果是技能页面，启动进度条动画
            if (sectionId === 'skills') {
                this.animateProgressBars();
            }
        });
    }
    
    navigateByScroll(direction) {
        const currentIndex = this.sections.indexOf(this.currentSection);
        let targetIndex = currentIndex + direction;
        
        if (targetIndex < 0) targetIndex = 0;
        if (targetIndex >= this.sections.length) targetIndex = this.sections.length - 1;
        
        if (targetIndex !== currentIndex) {
            this.navigateToSection(this.sections[targetIndex]);
        }
    }
    
    updateNavigation(activeSection) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === activeSection) {
                link.classList.add('active');
            }
        });
    }
    
    animateTransition(currentEl, targetEl, callback) {
        // 淡出当前页面
        currentEl.style.opacity = '1';
        currentEl.style.transform = 'translateY(0)';
        
        // 设置目标页面初始状态
        targetEl.style.display = 'flex';
        targetEl.style.opacity = '0';
        targetEl.style.transform = 'translateY(50px)';
        
        // 执行动画
        const timeline = [
            // 淡出当前页面
            () => {
                currentEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                currentEl.style.opacity = '0';
                currentEl.style.transform = 'translateY(-30px)';
            },
            // 隐藏当前页面，显示目标页面
            () => {
                setTimeout(() => {
                    currentEl.style.display = 'none';
                    currentEl.classList.remove('active');
                    
                    targetEl.classList.add('active');
                    targetEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    targetEl.style.opacity = '1';
                    targetEl.style.transform = 'translateY(0)';
                    
                    setTimeout(callback, 400);
                }, 300);
            }
        ];
        
        timeline[0]();
        timeline[1]();
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        
        // 动画化汉堡菜单
        const spans = this.navToggle.querySelectorAll('span');
        if (this.navToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        
        const spans = this.navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
    
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    this.navigateByScroll(-1);
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    this.navigateByScroll(1);
                    break;
                case 'Home':
                    e.preventDefault();
                    this.navigateToSection('home');
                    break;
                case 'End':
                    e.preventDefault();
                    this.navigateToSection('contact');
                    break;
            }
        });
    }
    
    initProgressBars() {
        this.progressBars = document.querySelectorAll('.progress-bar');
    }
    
    animateProgressBars() {
        this.progressBars.forEach((bar, index) => {
            const targetWidth = bar.getAttribute('data-width');
            
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, index * 200);
        });
    }
    
    initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // 添加卡片动画
                    const cards = entry.target.querySelectorAll('.glass-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, {
            threshold: 0.1
        });
        
        this.sectionElements.forEach(section => {
            observer.observe(section);
            
            // 初始化卡片状态
            const cards = section.querySelectorAll('.glass-card');
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
        });
    }
    
    showProjectModal() {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3>项目详情</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>这里可以展示项目的详细信息、截图、技术栈等内容。</p>
                    <p>您可以根据需要自定义这个模态框的内容。</p>
                </div>
                <div class="modal-footer">
                    <button class="glass-btn secondary">查看源码</button>
                    <button class="glass-btn primary">在线演示</button>
                </div>
            </div>
        `;
        
        // 添加样式
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(modal);
        
        // 动画显示
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
        
        // 关闭事件
        const closeModal = () => {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => modal.remove(), 300);
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    handleFormSubmit(e) {
        const form = e.target;
        const formData = new FormData(form);
        
        // 显示加载状态
        const submitBtn = form.querySelector('.glass-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '发送中...';
        submitBtn.disabled = true;
        
        // 模拟表单提交
        setTimeout(() => {
            submitBtn.textContent = '发送成功!';
            submitBtn.style.background = 'linear-gradient(45deg, rgba(76, 175, 80, 0.3), rgba(139, 195, 74, 0.3))';
            
            // 重置表单
            setTimeout(() => {
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 2000);
        }, 1500);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});