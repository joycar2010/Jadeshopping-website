import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddToCartAnimationProps } from '@/types';

const AddToCartAnimation: React.FC<AddToCartAnimationProps> = ({
  isAnimating,
  productImage,
  startPosition,
  endPosition,
  onAnimationComplete
}) => {
  const animationVariants = {
    initial: {
      x: startPosition.x - 32, // 减去图片宽度的一半 (64px / 2)
      y: startPosition.y - 32, // 减去图片高度的一半 (64px / 2)
      scale: 1,
      opacity: 1,
    },
    animate: {
      x: endPosition.x - 32,
      y: endPosition.y - 32,
      scale: 0.3,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94], // 自定义贝塞尔曲线，创建抛物线效果
        type: "tween"
      }
    }
  };

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          className="fixed z-50 pointer-events-none"
          style={{
            willChange: 'transform, opacity', // 启用硬件加速
          }}
          variants={animationVariants}
          initial="initial"
          animate="animate"
          onAnimationComplete={onAnimationComplete}
        >
          <img
            src={productImage}
            alt="Flying product"
            className="w-16 h-16 object-cover rounded-lg shadow-lg border-2 border-jade-200"
            style={{
              imageRendering: 'auto',
              backfaceVisibility: 'hidden', // 优化性能
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { AddToCartAnimation };
export default AddToCartAnimation;