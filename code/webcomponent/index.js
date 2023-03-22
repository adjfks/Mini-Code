"use strict";
class Wujie extends HTMLElement {
    constructor() {
        super();
        // 创建一个shadowDom 实现样式隔离
        let shadowDom = this.attachShadow({ mode: 'open' });
        // 给shadowDom的根节点添加内容
        const template = document.querySelector('#wujie-template');
        shadowDom.appendChild(template.content.cloneNode(true));
        // 获取属性
        let name = this.getAttr('name');
        console.log('name: ', name);
        let age = this.getAttr('age');
        console.log('age: ', age);
    }
    getAttr(attr) {
        return this.getAttribute(attr);
    }
    // 当 custom element 首次被插入文档 DOM 时，被调用。
    connectedCallback() {
        console.log('connectedCallback...');
    }
    // 当 custom element 从文档 DOM 中删除时，被调用。
    disconnectedCallback() {
        console.log('disconnectedCallback...');
    }
    // 当 custom element 增加、删除、修改自身属性时，被调用。
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('attributeChangedCallback...');
    }
    // 当 custom element 被移动到新的文档时，被调用。
    adoptedCallback() {
        console.log('adoptedCallback...');
    }
}
window.onload = () => {
    window.customElements.define('wu-jie', Wujie);
};
