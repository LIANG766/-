const navMenuItems = document.querySelectorAll('#nav-menu a');
 
// 设置指示器的点击切换
function handleMenuItemClick(target){
    navMenuItems.forEach(item=>{
        item.classList.remove('active');
        item.style='';
    });
    target.classList.add('active');
 
    //设置要展示的内容
    const cueerntSection = document.querySelector('.active-section');
    cueerntSection.classList.remove('active-section');
    const newCurrentSection = document.querySelector(`.${target.getAttribute('data-rel')}`);
    newCurrentSection.classList.add('active-section');
}
 
navMenuItems.forEach(item=>{
    item.addEventListener('click',e=>handleMenuItemClick(e.target));
    item.classList.contains('active') && handleMenuItemClick(item);
});

// 禁用F12键
document.addEventListener('keydown', function(event) {
    // 检测F12键
    if (event.key === 'F12') {
        event.preventDefault();
        return false;
    }
    
    // 检测Ctrl+Shift+I (开发者工具快捷键)
    if (event.ctrlKey && event.shiftKey && event.key === 'I') {
        event.preventDefault();
        return false;
    }
    
    // 检测Ctrl+Shift+J (控制台快捷键)
    if (event.ctrlKey && event.shiftKey && event.key === 'J') {
        event.preventDefault();
        return false;
    }
    
    // 检测Ctrl+U (查看源代码快捷键)
    if (event.ctrlKey && event.key.toLowerCase() === 'u') {
        event.preventDefault();
        return false;
    }
    
    // 检测Ctrl+S (保存页面快捷键)
    if (event.ctrlKey && event.key.toLowerCase() === 's') {
        event.preventDefault();
        return false;
    }
});

// 禁用右键菜单
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    return false;
});

// 禁用开发者工具的其他方式
document.addEventListener('keyup', function(event) {
    // 检测F12键释放
    if (event.key === 'F12') {
        event.preventDefault();
        return false;
    }
});

// 禁用选择文本
document.addEventListener('selectstart', function(event) {
    event.preventDefault();
    return false;
});

// 禁用拖拽
document.addEventListener('dragstart', function(event) {
    event.preventDefault();
    return false;
});