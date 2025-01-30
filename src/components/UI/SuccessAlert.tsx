// components/UI/SuccessAlert.tsx
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

interface SuccessAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessAlert = ({ isOpen, onClose }: SuccessAlertProps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60] animate-in fade-in duration-200">
      <div className="w-full h-full absolute bg-black/30 backdrop-blur-sm" />
      <div className="relative bg-[#1E1E1E]/90 border border-[#2BAD72]/20 rounded-2xl p-6 max-w-sm w-full mx-4 
        shadow-xl shadow-[#2BAD72]/10 transform transition-all scale-in-center animate-in zoom-in-50 duration-200">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#2BAD72]/10 flex items-center justify-center 
            animate-bounce duration-700">
            <CheckCircle2 className="w-10 h-10 text-[#2BAD72]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-white">Успешно!</h3>
            <p className="text-gray-400 text-sm">Перевод выполнен</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessAlert;