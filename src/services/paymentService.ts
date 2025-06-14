import axios from 'axios';

// Serviço de pagamento Pix (MVP) usando MercadoPago
// Para produção, use variáveis de ambiente para as chaves
const MERCADOPAGO_API = 'https://api.mercadopago.com/v1/payments';
const ACCESS_TOKEN = 'SEU_ACCESS_TOKEN_MERCADOPAGO'; // Troque pelo seu token

export async function criarPagamentoPix(valor, descricao, email) {
  const body = {
    transaction_amount: valor,
    description: descricao,
    payment_method_id: 'pix',
    payer: { email },
  };
  const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };
  const { data } = await axios.post(MERCADOPAGO_API, body, { headers });
  return data;
} 