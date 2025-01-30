import { useState, useEffect } from 'react';
import { X, Loader2, Timer } from 'lucide-react';
import { transferFunds } from '../../services/api';
import { storage } from '../../utils/storage';
import SuccessAlert from './SuccessAlert';

interface TransferModalProps {
 isOpen: boolean;
 onClose: () => void;
 token: string;
 defaultUsername?: string;
}

const TransferModal = ({ isOpen, onClose, token, defaultUsername }: TransferModalProps) => {
 const [username, setUsername] = useState(defaultUsername || '');
 const [amount, setAmount] = useState('');
 const [secretAnswer, setSecretAnswer] = useState('');
 const [comment, setComment] = useState('');
 const [isHoldEnabled, setIsHoldEnabled] = useState(false);
 const [holdLength, setHoldLength] = useState('');
 const [holdOption, setHoldOption] = useState('hour');
 const [error, setError] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [showSuccess, setShowSuccess] = useState(false);

 const timeOptions = [
   { value: 'hour', label: 'Час', max: 720 },
   { value: 'day', label: 'День', max: 30 },
   { value: 'week', label: 'Нед', max: 3 }
 ];

 useEffect(() => {
   const loadSecretWord = async () => {
     const saved = await storage.getSecretWord();
     if (saved) setSecretAnswer(saved);
   };
   if (isOpen) {
     loadSecretWord();
     if (defaultUsername) {
       setUsername(defaultUsername);
     }
   }
 }, [isOpen, defaultUsername]);

 const validateHoldLength = () => {
   const selectedOption = timeOptions.find(opt => opt.value === holdOption);
   if (!selectedOption) return false;

   const length = parseInt(holdLength);
   if (isNaN(length) || length <= 0) {
     setError('Некорректная длительность холда');
     return false;
   }

   if (length > selectedOption.max) {
     setError(`Максимальная длительность для "${selectedOption.label}": ${selectedOption.max}`);
     return false;
   }

   return true;
 };

 const handleTransfer = async (e: React.FormEvent) => {
   e.preventDefault();
   setError('');

   if (isHoldEnabled && !validateHoldLength()) {
     return;
   }

   setIsLoading(true);

   try {
     await transferFunds(token, {
       username,
       amount,
       secretAnswer,
       comment,
       isHoldEnabled,
       holdLength,
       holdOption
     });

     setShowSuccess(true);
     // Очищаем форму
     setAmount('');
     setComment('');
     setHoldLength('');
     setIsHoldEnabled(false);
     
     setTimeout(() => {
       onClose();
       setShowSuccess(false);
     }, 2000);
   } catch (error: any) {
     setError(error.message || 'Произошла ошибка');
   } finally {
     setIsLoading(false);
   }
 };

 if (!isOpen) return null;

 return (
   <>
     <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
       <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
       <div className="relative bg-[#1E1E1E]/90 w-full max-w-md rounded-2xl p-6 border border-[#333333] shadow-xl">
         <div className="flex justify-between items-center mb-4">
           <h2 className="text-lg font-bold text-white">Отправить средства</h2>
           <button
             onClick={onClose}
             className="text-gray-400 hover:text-white transition-colors"
           >
             <X size={20} />
           </button>
         </div>

         <form onSubmit={handleTransfer} className="space-y-4">
           <div className="space-y-3">
             <input
               type="text"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               placeholder="Получатель"
               className="w-full bg-[#141414] border-2 border-[#333333] text-white px-4 py-2.5 rounded-xl
               focus:border-[#2BAD72] outline-none transition-all placeholder:text-gray-500"
             />

             <input
               type="number"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               placeholder="Сумма"
                     className="w-full bg-[#141414] border-2 border-[#333333] text-white px-4 py-2.5 rounded-xl
                      focus:border-[#2BAD72] outline-none transition-all placeholder:text-gray-500
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

             <input
               type="password"
               value={secretAnswer}
               onChange={(e) => setSecretAnswer(e.target.value)}
               placeholder="Секретное слово"
               className="w-full bg-[#141414] border-2 border-[#333333] text-white px-4 py-2.5 rounded-xl
               focus:border-[#2BAD72] outline-none transition-all placeholder:text-gray-500"
             />

             <input
               type="text"
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               placeholder="Комментарий"
               className="w-full bg-[#141414] border-2 border-[#333333] text-white px-4 py-2.5 rounded-xl
               focus:border-[#2BAD72] outline-none transition-all placeholder:text-gray-500"
             />

             <div 
               onClick={() => setIsHoldEnabled(!isHoldEnabled)}
               className="flex items-center gap-3 p-3 bg-[#141414] rounded-xl border-2 border-[#333333] 
               cursor-pointer transition-all hover:border-[#2BAD72]/30"
             >
               <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out 
                 ${isHoldEnabled ? 'bg-[#2BAD72]' : 'bg-[#333333]'}`}
               >
                 <div className={`w-4 h-4 rounded-full transition-all duration-200 ease-in-out
                   ${isHoldEnabled ? 'bg-white translate-x-6' : 'bg-gray-400 translate-x-0'}
                 `}/>
               </div>
               <div className="flex items-center gap-2">
                 <Timer className={`w-5 h-5 transition-colors ${isHoldEnabled ? 'text-[#2BAD72]' : 'text-gray-400'}`} />
                 <span className={`font-medium transition-colors ${isHoldEnabled ? 'text-white' : 'text-gray-400'}`}>
                   Включить холд
                 </span>
               </div>
             </div>

             {isHoldEnabled && (
               <div className="space-y-3">
                 <div className="relative">
                   <input
                     type="number"
                     value={holdLength}
                     onChange={(e) => setHoldLength(e.target.value)}
                     placeholder="Длительность холда"
                     className="w-full bg-[#141414] border-2 border-[#333333] text-white px-4 py-2.5 rounded-xl
                      focus:border-[#2BAD72] outline-none transition-all placeholder:text-gray-500
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                   <p className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                     макс: {timeOptions.find(opt => opt.value === holdOption)?.max || 0}
                   </p>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-1">
                   {timeOptions.map(({ value, label }) => (
                     <button
                       key={value}
                       type="button"
                       onClick={() => setHoldOption(value)}
                       className={`p-2 rounded-lg text-xs font-medium transition-all
                       ${holdOption === value 
                         ? 'bg-[#2BAD72] text-white shadow-lg shadow-[#2BAD72]/20' 
                         : 'bg-[#141414] text-gray-400 hover:bg-[#2BAD72]/20'}`}
                     >
                       {label}
                     </button>
                   ))}
                 </div>
               </div>
             )}
           </div>

           {error && (
             <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
               {error}
             </div>
           )}

           <button
             type="submit"
             disabled={isLoading || !username || !amount || !secretAnswer}
             className="w-full bg-gradient-to-r from-[#2BAD72] to-[#229861] text-white py-3 px-4 rounded-xl
             hover:from-[#229861] hover:to-[#1b8b4f] transition-all duration-300 flex items-center justify-center gap-2
             disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#2BAD72]/20"
           >
             {isLoading ? (
               <>
                 <Loader2 className="w-5 h-5 animate-spin" />
                 Отправка...
               </>
             ) : (
               'Отправить'
             )}
           </button>
         </form>
       </div>
     </div>

     <SuccessAlert
       isOpen={showSuccess}
       onClose={() => setShowSuccess(false)}
     />
   </>
 );
};

export default TransferModal;