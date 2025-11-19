import jsPDF from 'jspdf';
import { Investment } from '../types/asset';
import { formatDate, formatCurrency } from './calculations';
import { AssetTypeLabels, isUnitBased } from '../types/asset';

export const exportInvestmentToPDF = (investment: Investment): void => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Cores
    const primaryColor = [37, 99, 235]; // #2563EB
    const textColor = [17, 24, 39]; // #111827
    const grayColor = [107, 114, 128]; // #6B7280

    // Título
    doc.setFontSize(20);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('S² - Stonks ao Quadrado', margin, yPosition);
    
    yPosition += 8;
    doc.setFontSize(16);
    doc.setTextColor(...textColor);
    doc.text('Comprovante de Aporte', margin, yPosition);
    
    yPosition += 15;

    // Linha divisória
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Data do Aporte
    doc.setFontSize(12);
    doc.setTextColor(...grayColor);
    doc.setFont('helvetica', 'normal');
    doc.text('Data do Aporte:', margin, yPosition);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.text(formatDate(investment.date), margin + 50, yPosition);
    
    yPosition += 15;

    // Resumo
    doc.setFontSize(14);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo do Aporte', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    
    // Valor Planejado
    doc.text('Valor Planejado:', margin, yPosition);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(investment.plannedValue), pageWidth - margin - 60, yPosition, {
      align: 'right',
    });
    yPosition += 8;

    // Valor Executado
    doc.setTextColor(...grayColor);
    doc.setFont('helvetica', 'normal');
    doc.text('Valor Executado:', margin, yPosition);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(investment.executedValue), pageWidth - margin - 60, yPosition, {
      align: 'right',
    });
    yPosition += 8;

    // Diferença
    doc.setTextColor(...grayColor);
    doc.setFont('helvetica', 'normal');
    doc.text('Diferença (Resto):', margin, yPosition);
    const diffColor = investment.difference >= 0 ? [37, 99, 235] : [220, 38, 38];
    doc.setTextColor(...diffColor);
    doc.setFont('helvetica', 'bold');
    const diffText = `${formatCurrency(Math.abs(investment.difference))}${
      investment.difference < 0 ? ' (excedente)' : ''
    }`;
    doc.text(diffText, pageWidth - margin - 60, yPosition, {
      align: 'right',
    });
    
    yPosition += 15;

    // Linha divisória
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Detalhes dos Ativos
    doc.setFontSize(14);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhes dos Ativos', margin, yPosition);
    yPosition += 10;

    // Tabela de ativos
    const tableStartY = yPosition;
    let currentY = tableStartY;

    // Cabeçalho da tabela
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Ativo', margin, currentY);
    doc.text('Tipo', margin + 50, currentY);
    doc.text('Detalhes', margin + 90, currentY);
    doc.text('Valor', pageWidth - margin - 30, currentY, { align: 'right' });
    
    currentY += 8;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 5;

    // Itens da tabela
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    investment.items.forEach((item, index) => {
      // Verificar se precisa de nova página
      if (currentY > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        currentY = margin + 10;
      }

      const isUnit = isUnitBased(item.assetType);
      doc.setTextColor(...textColor);
      
      // Nome do ativo
      doc.setFont('helvetica', 'bold');
      doc.text(item.assetName.substring(0, 15), margin, currentY);
      
      // Tipo
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...grayColor);
      doc.text(AssetTypeLabels[item.assetType].substring(0, 10), margin + 50, currentY);
      
      // Detalhes - posição fixa com limite para não sobrepor com Valor
      const detalhesX = margin + 90;
      const valorX = pageWidth - margin - 30;
      const detalhesMaxX = valorX - 10; // 10px de margem entre Detalhes e Valor
      
      if (isUnit && item.price !== undefined && item.quantity !== undefined) {
        const detalhesText = `${item.quantity} un × ${formatCurrency(item.price)}`;
        // Verificar se o texto cabe no espaço disponível
        doc.setFontSize(9);
        const textWidth = doc.getTextWidth(detalhesText);
        const availableWidth = detalhesMaxX - detalhesX;
        
        if (textWidth > availableWidth) {
          // Truncar texto se necessário
          let truncatedText = detalhesText;
          while (doc.getTextWidth(truncatedText) > availableWidth && truncatedText.length > 0) {
            truncatedText = truncatedText.substring(0, truncatedText.length - 1);
          }
          doc.text(truncatedText, detalhesX, currentY);
        } else {
          doc.text(detalhesText, detalhesX, currentY);
        }
        
        doc.setTextColor(...textColor);
        doc.setFont('helvetica', 'bold');
        doc.text(
          formatCurrency(item.price * item.quantity),
          valorX,
          currentY,
          { align: 'right' }
        );
      } else if (!isUnit && item.investedValue !== undefined) {
        doc.text('Valor investido', detalhesX, currentY);
        doc.setTextColor(...textColor);
        doc.setFont('helvetica', 'bold');
        doc.text(
          formatCurrency(item.investedValue, item.currency || 'BRL'),
          valorX,
          currentY,
          { align: 'right' }
        );
      }

      currentY += 8;
      
      // Linha separadora (exceto último item)
      if (index < investment.items.length - 1) {
        doc.setDrawColor(243, 244, 246);
        doc.setLineWidth(0.2);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 5;
      }
    });

    // Rodapé
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Gerado em ${new Date().toLocaleString('pt-BR')}`,
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );

    // Nome do arquivo
    const fileName = `Aporte_${formatDate(investment.date).replace(/\//g, '-')}_${Date.now()}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Não foi possível gerar o PDF. Tente novamente.');
  }
};

