import type React from "react"
import { View, Text } from "react-native"
import { globalStyles } from "@/styles/globals"
import { criarPagamentoPix } from '../services/paymentService';
import { Button } from '../components/Button';

export const SettingsScreen: React.FC = () => {
  return (
    <View style={[globalStyles.container, globalStyles.centerContent]}>
      <Text style={globalStyles.title}>Configurações</Text>
      <Text style={globalStyles.subtitle}>Esta funcionalidade será implementada em breve.</Text>
      <Button
        title="Upgrade para Premium (Pix)"
        onPress={async () => {
          try {
            const pagamento = await criarPagamentoPix(19.90, 'Assinatura Premium FalaAtípica', usuario.email);
            alert('Pagamento Pix gerado! Veja o QR Code no painel web ou email.');
          } catch (e) {
            alert('Erro ao gerar pagamento Pix.');
          }
        }}
        style={{ backgroundColor: '#43a047', marginVertical: 16 }}
      />
    </View>
  )
}
