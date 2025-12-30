import logo from '../../assets/images/logo.webp';
import styles from './styles.module.css'; // Importa os estilos (Overlay, Content, Button)

interface CustomAlertProps {
  message: string; // A mensagem de texto que será exibida (ex: "Link Copiado!")
  onClose: () => void; // Função para fechar o alerta ao clicar no OK ou no fundo
}

export function CustomAlert({ message, onClose }: CustomAlertProps) {
  return (
    /** * OVERLAY (Fundo Escurecido):
     * Ocupa a tela inteira. Ao clicar nele, o alerta fecha.
     */
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* Logo do projeto para reforçar o branding dentro do aviso */}
        <img className={styles['logo-image']} src={logo} alt='Logo' />

        {/* Mensagem principal do alerta */}
        <p
          style={{
            color: '#a09b8c', // Cor acinzentada estilo LoL
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontSize: '1.1rem',
            fontFamily: 'sans-serif',
          }}
        >
          {message}
        </p>

        {/* Botão de confirmação estilizado com o gradiente dourado */}
        <button className={styles.downloadButton} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}
