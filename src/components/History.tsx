// src/components/History.tsx
import { useState, useEffect } from 'react';
import { RefreshCw, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { fetchPaymentHistory } from '../services/api';
import { apiManager } from '../services/api';

interface HistoryProps {
  token: string;
}

interface Payment {
  label: {
    title: string;
  };
  data: {
    comment: string | null;
  };
  outgoing_sum: number;
  incoming_sum: number;
}

interface PaymentHistory {
  payments: {
    [key: string]: Payment;
  };
}

const History = ({ token }: HistoryProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPayments = async () => {
    if (apiManager.isRequestInProgress()) {
      setError('Подождите, идет загрузка данных');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchPaymentHistory(token) as PaymentHistory;
      
      const paymentArray = Object.entries(data.payments)
        .map(([id, payment]) => ({
          ...payment,
          id: parseInt(id)
        }))
        .sort((a, b) => b.id - a.id);

      setPayments(paymentArray);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      console.error('Payment history error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    const remainingCooldown = apiManager.getRemainingCooldown();
    if (remainingCooldown > 0) {
      setError(`Подождите ${Math.ceil(remainingCooldown / 1000)} сек`);
      return;
    }
    await loadPayments();
  };

  useEffect(() => {
    loadPayments();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#161616] bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {/* Заголовок и кнопка обновления */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">История платежей</h1>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg bg-[#1E1E1E] border border-[#333333] 
            hover:border-[#2BAD72]/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            title="Обновить"
          >
            <RefreshCw 
              className={`w-5 h-5 text-[#2BAD72] transition-all
                ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`}
            />
          </button>
        </div>

        {error && !isLoading && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Список платежей */}
        <div className="space-y-2.5">
          {isLoading && payments.length === 0 ? (
            <div className="bg-[#1E1E1E]/80 backdrop-blur-sm rounded-xl p-4 
              border border-[#333333] flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-[#2BAD72] animate-spin" />
            </div>
          ) : payments.length === 0 ? (
            <div className="bg-[#1E1E1E]/80 backdrop-blur-sm rounded-xl p-4 
              border border-[#333333] text-center text-gray-400">
              Нет платежей
            </div>
          ) : (
            payments.map((payment, index) => (
              <div
                key={index}
                className="bg-[#1E1E1E]/80 backdrop-blur-sm rounded-xl p-3.5 
                border border-[#333333] hover:border-[#2BAD72]/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`rounded-lg p-1.5 flex-shrink-0 ${
                      payment.outgoing_sum > 0 
                        ? 'bg-red-500/10 text-red-500' 
                        : 'bg-green-500/10 text-green-500'
                    }`}>
                      {payment.outgoing_sum > 0 
                        ? <ArrowUpRight className="w-4 h-4" />
                        : <ArrowDownLeft className="w-4 h-4" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate group-hover:text-[#2BAD72] transition-colors">
                        {payment.label.title}
                      </p>
                      {payment.data.comment && (
                        <p className="text-gray-400 text-xs truncate mt-0.5">
                          {payment.data.comment}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className={`text-sm font-medium whitespace-nowrap ${
                    payment.outgoing_sum > 0 
                      ? 'text-red-500' 
                      : 'text-green-500'
                  }`}>
                    {payment.outgoing_sum > 0 
                      ? `-${payment.outgoing_sum}`
                      : `+${payment.incoming_sum}`
                    } ₽
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default History;