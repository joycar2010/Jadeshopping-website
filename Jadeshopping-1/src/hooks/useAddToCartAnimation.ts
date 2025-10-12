import { useState, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { 
  AnimationState, 
  AnimationData, 
  Product, 
  UseAddToCartAnimationReturn,
  Position 
} from '@/types';

export const useAddToCartAnimation = (): UseAddToCartAnimationReturn => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    isAnimating: false,
    animationQueue: [],
    currentAnimation: null,
  });

  const { addToCart } = useStore();

  // 获取购物车图标位置
  const getCartIconPosition = useCallback((): Position => {
    const cartIcon = document.querySelector('[data-cart-icon]');
    if (cartIcon) {
      const rect = cartIcon.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
    // 默认位置（右上角）
    return { x: window.innerWidth - 50, y: 50 };
  }, []);

  // 检查用户是否偏好减少动画
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // 触发动画
  const triggerAnimation = useCallback((
    product: Product, 
    clickEvent: React.MouseEvent
  ) => {
    // 如果用户偏好减少动画，直接添加到购物车并触发弹跳效果
    if (prefersReducedMotion()) {
      addToCart(product);
      // 触发购物车图标弹跳效果
      window.dispatchEvent(new CustomEvent('cart-bounce'));
      return;
    }

    // 如果正在动画中，防止重复触发
    if (animationState.isAnimating) {
      return;
    }

    const startPosition: Position = {
      x: clickEvent.clientX,
      y: clickEvent.clientY,
    };
    
    const endPosition = getCartIconPosition();
    
    const animationData: AnimationData = {
      id: `${product.id}-${Date.now()}`,
      product,
      startPosition,
      endPosition,
      timestamp: Date.now(),
    };

    setAnimationState(prev => ({
      ...prev,
      isAnimating: true,
      currentAnimation: animationData,
    }));
  }, [animationState.isAnimating, getCartIconPosition, prefersReducedMotion, addToCart]);

  // 动画完成回调
  const onAnimationComplete = useCallback(() => {
    if (animationState.currentAnimation) {
      // 添加到购物车
      addToCart(animationState.currentAnimation.product);
      
      // 触发购物车图标弹跳效果
      window.dispatchEvent(new CustomEvent('cart-bounce'));
    }

    // 重置动画状态
    setAnimationState(prev => ({
      ...prev,
      isAnimating: false,
      currentAnimation: null,
    }));
  }, [animationState.currentAnimation, addToCart]);

  return {
    triggerAnimation,
    isAnimating: animationState.isAnimating,
    animationData: animationState.currentAnimation,
    onAnimationComplete,
  };
};