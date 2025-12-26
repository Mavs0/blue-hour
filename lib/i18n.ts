// Sistema de internacionalização simples

export type Locale = "pt-BR" | "en-US" | "es-ES";

export const locales: Locale[] = ["pt-BR", "en-US", "es-ES"];

export const localeNames: Record<Locale, string> = {
  "pt-BR": "Português (Brasil)",
  "en-US": "English (US)",
  "es-ES": "Español",
};

// Traduções
export const translations: Record<Locale, Record<string, string>> = {
  "pt-BR": {
    // Navegação
    "nav.home": "Início",
    "nav.events": "Eventos",
    "nav.tickets": "Meus Ingressos",
    "nav.profile": "Meu Perfil",
    "nav.settings": "Configurações",
    "nav.notifications": "Notificações",
    "nav.admin": "Admin",
    "nav.logout": "Sair",
    "nav.search.placeholder": "Buscar eventos...",
    "nav.user": "Usuário",
    "nav.switchAccount": "Trocar de Conta",
    "nav.help": "Ajuda",

    // Footer
    "footer.description":
      "Comissão de eventos especializada em trazer experiências exclusivas do {brand} para Manaus. Eventos cuidadosamente curados para criar momentos mágicos e inesquecíveis.",
    "footer.quickLinks": "Links Rápidos",
    "footer.about": "Sobre Nós",
    "footer.admin": "Área Admin",
    "footer.contact": "Contato",
    "footer.location": "Manaus, AM",
    "footer.email": "contato@bluehour.com.br",
    "footer.exclusive": "Eventos Exclusivos",
    "footer.copyright":
      "© {year} Blue Hour - Comissão de Eventos. Todos os direitos reservados.",

    // Configurações
    "settings.title": "Configurações",
    "settings.subtitle": "Gerencie suas preferências e configurações da conta",
    "settings.theme": "Tema",
    "settings.theme.light": "Claro",
    "settings.theme.dark": "Escuro",
    "settings.theme.system": "Sistema",
    "settings.language": "Idioma",
    "settings.save": "Salvar Configurações",
    "settings.saving": "Salvando...",
    "settings.saved": "Configurações salvas com sucesso!",

    // Notificações
    "notifications.title": "Notificações",
    "notifications.subtitle":
      "Escolha como e quando você deseja ser notificado",
    "notifications.email": "Notificações por Email",
    "notifications.email.desc": "Receba notificações importantes por email",
    "notifications.purchase": "Confirmação de Compra",
    "notifications.purchase.desc": "Receba email quando realizar uma compra",
    "notifications.payment": "Status de Pagamento",
    "notifications.payment.desc":
      "Receba atualizações sobre o status do pagamento",
    "notifications.reminder": "Lembretes de Eventos",
    "notifications.reminder.desc":
      "Receba lembretes antes dos eventos que você comprou",
    "notifications.promotions": "Promoções e Ofertas",
    "notifications.promotions.desc": "Receba ofertas exclusivas e novidades",

    // Preferências
    "preferences.title": "Preferências",
    "preferences.subtitle": "Personalize sua experiência na plataforma",

    // Privacidade
    "privacy.title": "Privacidade e Segurança",
    "privacy.subtitle": "Gerencie suas configurações de privacidade",
    "privacy.dataSafe":
      "Seus dados estão seguros: Utilizamos criptografia para proteger suas informações pessoais e de pagamento. Nunca compartilhamos seus dados com terceiros sem sua autorização.",
    "privacy.changePassword": "Alterar Senha",
    "privacy.authComingSoon":
      "Sistema de autenticação será implementado em breve",

    // Links rápidos
    "links.profile.title": "Meu Perfil",
    "links.profile.desc": "Editar informações pessoais",
    "links.tickets.title": "Meus Ingressos",
    "links.tickets.desc": "Ver suas compras",
    "links.events.title": "Eventos",
    "links.events.desc": "Explorar eventos disponíveis",

    // Homepage
    "home.hero.badge": "Eventos Exclusivos TXT",
    "home.hero.title": "Blue Hour",
    "home.hero.subtitle": "A maior experiência de K-POP em Manaus",
    "home.hero.cta": "Ver Eventos Disponíveis",
    "home.events.title": "Eventos em Destaque",
    "home.events.subtitle": "Confira os próximos eventos do TXT em Manaus",
    "home.events.viewAll": "Ver Todos",
    "home.events.viewAllMobile": "Ver Todos os Eventos",
    "home.events.none": "Nenhum evento disponível no momento",
    "home.events.noneDesc": "Fique atento para novos eventos em breve!",
    "home.events.available": "Disponível",
    "home.events.soldOut": "Esgotado",
    "home.events.fromPrice": "A partir de",
    "home.events.buy": "Comprar",
    "home.events.ticketTypes": "tipo",
    "home.events.ticketTypesPlural": "tipos",
    "home.events.ofTicket": "de ingresso",
    "home.events.pricesSoon": "Preços em breve",
    "home.why.title": "Por que escolher a Blue Hour?",
    "home.why.subtitle": "A melhor experiência de eventos TXT em Manaus",
    "home.why.tickets.title": "Ingressos Seguros",
    "home.why.tickets.desc":
      "Sistema confiável e seguro para compra de ingressos online",
    "home.why.events.title": "Eventos Exclusivos",
    "home.why.events.desc": "Acesso aos melhores eventos do TXT em Manaus",
    "home.why.community.title": "Comunidade MOA",
    "home.why.community.desc":
      "Conecte-se com outros fãs e viva momentos inesquecíveis",
    "home.cta.title": "Não perca nossos próximos eventos TXT",
    "home.cta.subtitle":
      "Fique por dentro de todos os eventos exclusivos da Blue Hour",
    "home.cta.button": "Ver Todos os Eventos",

    // Erros
    "error.saveSettings": "Erro ao salvar configurações",

    // Ajuda
    "help.title": "Central de Ajuda",
    "help.subtitle":
      "Encontre respostas para suas dúvidas ou entre em contato conosco",
    "help.search.placeholder": "Busque por palavras-chave...",
    "help.categories.all": "Todos",
    "help.categories.tickets": "Compra de Ingressos",
    "help.categories.payment": "Pagamento",
    "help.categories.account": "Conta e Perfil",
    "help.categories.events": "Eventos",
    "help.categories.security": "Segurança",
    "help.noResults":
      "Nenhuma pergunta encontrada com os filtros selecionados.",
    "help.guides.title": "Guias Rápidos",
    "help.guides.myTickets.title": "Meus Ingressos",
    "help.guides.myTickets.desc": "Acesse seus ingressos comprados",
    "help.guides.myProfile.title": "Meu Perfil",
    "help.guides.myProfile.desc": "Gerencie suas informações",
    "help.guides.settings.title": "Configurações",
    "help.guides.settings.desc": "Ajuste suas preferências",
    "help.guides.viewEvents.title": "Ver Eventos",
    "help.guides.viewEvents.desc": "Explore eventos disponíveis",
    "help.contact.title": "Ainda precisa de ajuda?",
    "help.contact.subtitle":
      "Entre em contato conosco através dos canais abaixo",
    "help.contact.email": "Email",
    "help.contact.emailResponse": "Resposta em até 24h",
    "help.contact.phone": "Telefone",
    "help.contact.phoneHours": "Seg-Sex, 9h às 18h",
    "help.contact.hours": "Horário de Atendimento",
    "help.contact.hoursDesc": "Segunda a Sexta",
    "help.contact.hoursTime": "9h às 18h (horário de Manaus)",
    "help.contact.tip": "Dica:",
    "help.contact.tipText":
      "Antes de entrar em contato, verifique se sua dúvida já está respondida na seção de perguntas frequentes acima. Isso pode agilizar o atendimento!",
    "help.privacy.title": "Política de Privacidade",
    "help.privacy.desc":
      "Seus dados estão protegidos. Conheça nossa política de privacidade e termos de uso.",
    "help.privacy.button": "Ver Política Completa",
    "help.terms.title": "Termos de Uso",
    "help.terms.desc":
      "Leia nossos termos e condições antes de utilizar nossos serviços.",
    "help.terms.button": "Ver Termos Completos",

    // FAQ - Compra de Ingressos
    "help.faq.tickets.howToBuy": "Como compro ingressos?",
    "help.faq.tickets.howToBuy.answer":
      "Para comprar ingressos, navegue até a página do evento desejado, selecione o tipo de ingresso e a quantidade, preencha seus dados pessoais, escolha a forma de pagamento e finalize a compra. Você receberá um código de confirmação por email.",
    "help.faq.tickets.paymentMethods": "Quais formas de pagamento são aceitas?",
    "help.faq.tickets.paymentMethods.answer":
      "Aceitamos PIX, Cartão de Crédito, Cartão de Débito e Boleto Bancário. O pagamento via PIX é confirmado automaticamente em até 2 minutos. Para cartões, a confirmação é imediata. Boletos têm validade de 3 dias.",
    "help.faq.tickets.multipleTickets": "Posso comprar mais de um ingresso?",
    "help.faq.tickets.multipleTickets.answer":
      "Sim! Você pode comprar até 10 ingressos por transação. Basta selecionar a quantidade desejada no momento da compra.",
    "help.faq.tickets.howToReceive": "Como recebo meu ingresso?",
    "help.faq.tickets.howToReceive.answer":
      "Após a confirmação do pagamento, você receberá um email com o código da compra e o QR Code do ingresso. Você também pode acessar seus ingressos na seção 'Meus Ingressos' usando seu email ou CPF.",

    // FAQ - Pagamento
    "help.faq.payment.timeToPay": "Quanto tempo tenho para pagar?",
    "help.faq.payment.timeToPay.answer":
      "Para PIX e Cartão, o pagamento deve ser realizado imediatamente. Para Boleto, você tem 3 dias corridos a partir da data de geração. Após esse período, o boleto expira e você precisará realizar uma nova compra.",
    "help.faq.payment.notConfirmed":
      "Meu pagamento não foi confirmado, o que fazer?",
    "help.faq.payment.notConfirmed.answer":
      "Pagamentos via PIX podem levar até 2 minutos para serem confirmados. Se após esse período o pagamento ainda estiver pendente, verifique se o pagamento foi realizado corretamente. Para cartões, entre em contato conosco se houver problemas. Para boletos, verifique se o pagamento foi realizado dentro do prazo de validade.",
    "help.faq.payment.cancel": "Posso cancelar uma compra?",
    "help.faq.payment.cancel.answer":
      "Cancelamentos podem ser solicitados através do nosso suporte. O reembolso seguirá nossa política de cancelamento, que varia conforme a proximidade da data do evento. Entre em contato conosco para mais informações.",

    // FAQ - Conta e Perfil
    "help.faq.account.needAccount": "Preciso criar uma conta para comprar?",
    "help.faq.account.needAccount.answer":
      "Não é necessário criar uma conta. Você pode comprar ingressos informando seus dados pessoais. No entanto, ao fazer uma compra, seus dados são salvos e você pode acessar seus ingressos usando seu email ou CPF na seção 'Meus Ingressos'.",
    "help.faq.account.accessTickets": "Como acesso meus ingressos?",
    "help.faq.account.accessTickets.answer":
      "Acesse a seção 'Meus Ingressos' no menu e informe seu email ou CPF usado na compra. Você verá todas as suas compras e poderá visualizar os detalhes, QR Codes e códigos de pagamento quando necessário.",
    "help.faq.account.updateData": "Como atualizo meus dados pessoais?",
    "help.faq.account.updateData.answer":
      "Acesse a seção 'Meu Perfil' no menu, informe seu email ou CPF para buscar seu perfil, e então você poderá editar suas informações pessoais como nome, telefone e CPF.",

    // FAQ - Eventos
    "help.faq.events.whereToSee": "Onde posso ver os eventos disponíveis?",
    "help.faq.events.whereToSee.answer":
      "Na página inicial você encontrará os eventos em destaque. Para ver todos os eventos disponíveis, acesse a seção 'Eventos' no menu principal ou use a barra de busca para encontrar eventos específicos.",
    "help.faq.events.soldOut": "Os ingressos podem esgotar?",
    "help.faq.events.soldOut.answer":
      "Sim, cada tipo de ingresso tem uma quantidade limitada. Recomendamos realizar a compra assim que os ingressos forem disponibilizados para garantir sua participação no evento.",

    // FAQ - Segurança
    "help.faq.security.dataSafe": "Meus dados estão seguros?",
    "help.faq.security.dataSafe.answer":
      "Sim! Utilizamos criptografia para proteger todas as informações pessoais e de pagamento. Nunca compartilhamos seus dados com terceiros sem sua autorização. Para mais informações, consulte nossa política de privacidade.",
    "help.faq.security.lostCode": "O que fazer se perder meu código de compra?",
    "help.faq.security.lostCode.answer":
      "Não se preocupe! Você pode acessar seus ingressos a qualquer momento na seção 'Meus Ingressos' usando seu email ou CPF. Todos os seus ingressos e códigos estarão disponíveis lá.",

    // Meus Ingressos
    "tickets.title": "Meus Ingressos",
    "tickets.subtitle": "Consulte suas compras informando seu email ou CPF",
    "tickets.search.title": "Buscar Minhas Compras",
    "tickets.search.subtitle":
      "Informe seu email ou CPF para visualizar seus ingressos",
    "tickets.search.email": "Email",
    "tickets.search.emailPlaceholder": "seu@email.com",
    "tickets.search.cpf": "CPF",
    "tickets.search.cpfPlaceholder": "000.000.000-00",
    "tickets.search.button": "Buscar Ingressos",
    "tickets.search.loading": "Buscando...",
    "tickets.search.error": "Por favor, informe seu email ou CPF",
    "tickets.search.errorFetch": "Erro ao buscar suas compras",
    "tickets.search.errorRetry":
      "Erro ao buscar suas compras. Tente novamente.",
    "tickets.greeting": "Olá, {name}!",
    "tickets.found": "Encontramos {count} compra(s) realizada(s)",
    "tickets.status.cancelled": "Cancelada",
    "tickets.status.confirmed": "Confirmada",
    "tickets.status.processing": "Processando",
    "tickets.status.expired": "Expirado",
    "tickets.status.pending": "Aguardando Pagamento",
    "tickets.details.title": "Detalhes da Compra",
    "tickets.details.code": "Código:",
    "tickets.details.ticketType": "Tipo de Ingresso:",
    "tickets.details.quantity": "Quantidade:",
    "tickets.details.quantityUnit": "ingresso(s)",
    "tickets.details.unitPrice": "Valor Unitário:",
    "tickets.details.paymentMethod": "Forma de Pagamento:",
    "tickets.details.total": "Total:",
    "tickets.details.purchaseDate": "Compra realizada em {date}",
    "tickets.actions.title": "Ações",
    "tickets.actions.viewPix": "Ver QR Code PIX",
    "tickets.actions.viewBarcode": "Ver Código de Barras",
    "tickets.actions.download": "Baixar Ingresso",
    "tickets.actions.viewDetails": "Ver Detalhes Completos",
    "tickets.actions.downloadSoon": "Download de QR Code em breve!",
    "tickets.pending.warning": "Atenção:",
    "tickets.pending.message":
      "Seu pagamento ainda está pendente. Após a confirmação, você receberá seu ingresso por email.",
    "tickets.pastEvent.message":
      "Este evento já aconteceu. Obrigado por participar!",
    "tickets.none.title": "Nenhuma compra encontrada para este cliente.",
    "tickets.none.button": "Ver Eventos Disponíveis",
    "tickets.payment.pix": "PIX",
    "tickets.payment.creditCard": "Cartão de Crédito",
    "tickets.payment.debitCard": "Cartão de Débito",
    "tickets.payment.bankSlip": "Boleto Bancário",

    // Meu Perfil
    "profile.title": "Meu Perfil",
    "profile.subtitle": "Gerencie suas informações pessoais e dados de conta",
    "profile.access.title": "Acessar Perfil",
    "profile.access.subtitle":
      "Informe seu email ou CPF para acessar seu perfil",
    "profile.access.email": "Email",
    "profile.access.emailPlaceholder": "seu@email.com",
    "profile.access.cpf": "CPF",
    "profile.access.cpfPlaceholder": "000.000.000-00",
    "profile.access.button": "Acessar Perfil",
    "profile.access.loading": "Buscando...",
    "profile.access.error": "Por favor, informe seu email ou CPF",
    "profile.access.errorFetch": "Erro ao buscar perfil",
    "profile.access.errorRetry": "Erro ao buscar perfil. Tente novamente.",
    "profile.edit.title": "Editar Informações",
    "profile.edit.subtitle": "Atualize suas informações pessoais",
    "profile.edit.name": "Nome Completo",
    "profile.edit.namePlaceholder": "Seu nome completo",
    "profile.edit.email": "Email",
    "profile.edit.emailPlaceholder": "seu@email.com",
    "profile.edit.emailDisabled": "O email não pode ser alterado",
    "profile.edit.phone": "Telefone",
    "profile.edit.phonePlaceholder": "(00) 00000-0000",
    "profile.edit.cpf": "CPF",
    "profile.edit.cpfPlaceholder": "000.000.000-00",
    "profile.edit.save": "Salvar Alterações",
    "profile.edit.saving": "Salvando...",
    "profile.edit.success": "Perfil atualizado com sucesso!",
    "profile.edit.error": "Erro ao atualizar perfil",
    "profile.edit.errorRetry": "Erro ao atualizar perfil. Tente novamente.",
    "profile.edit.searchOther": "Buscar Outro Perfil",
    "profile.info.totalPurchases": "Total de Compras",
    "profile.info.memberSince": "Membro desde {date}",
    "profile.links.tickets.title": "Meus Ingressos",
    "profile.links.tickets.desc": "Ver todas as suas compras",
    "profile.links.settings.title": "Configurações",
    "profile.links.settings.desc": "Preferências e notificações",
    "profile.validation.nameMin": "Nome deve ter pelo menos 2 caracteres",
    "profile.validation.emailInvalid": "Email inválido",
    "profile.validation.cpfInvalid": "CPF inválido",
    "profile.validation.cpfLength": "CPF deve ter 11 dígitos",

    // Mensagens de erro e sucesso
    "error.generic": "Ocorreu um erro. Tente novamente.",
    "error.network": "Erro de conexão. Verifique sua internet.",
    "error.validation": "Dados inválidos. Verifique os campos.",
    "error.rateLimit": "Muitas tentativas. Aguarde um momento.",
    "error.unauthorized": "Acesso não autorizado.",
    "error.notFound": "Recurso não encontrado.",
    "success.saved": "Salvo com sucesso!",
    "success.updated": "Atualizado com sucesso!",
    "success.deleted": "Excluído com sucesso!",
    "success.created": "Criado com sucesso!",
    "success.action": "Ação realizada com sucesso!",

    // Confirmações
    "confirm.delete": "Tem certeza que deseja excluir?",
    "confirm.cancel": "Tem certeza que deseja cancelar?",
    "confirm.action": "Tem certeza que deseja realizar esta ação?",
    "confirm.irreversible": "Esta ação não pode ser desfeita.",
  },
  "en-US": {
    // Navigation
    "nav.home": "Home",
    "nav.events": "Events",
    "nav.tickets": "My Tickets",
    "nav.profile": "My Profile",
    "nav.settings": "Settings",
    "nav.notifications": "Notifications",
    "nav.admin": "Admin",
    "nav.logout": "Logout",
    "nav.search.placeholder": "Search events...",
    "nav.user": "User",
    "nav.switchAccount": "Switch Account",
    "nav.help": "Help",

    // Footer
    "footer.description":
      "Event commission specialized in bringing exclusive {brand} experiences to Manaus. Carefully curated events to create magical and unforgettable moments.",
    "footer.quickLinks": "Quick Links",
    "footer.about": "About Us",
    "footer.admin": "Admin Area",
    "footer.contact": "Contact",
    "footer.location": "Manaus, AM",
    "footer.email": "contato@bluehour.com.br",
    "footer.exclusive": "Exclusive Events",
    "footer.copyright":
      "© {year} Blue Hour - Event Commission. All rights reserved.",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Manage your preferences and account settings",
    "settings.theme": "Theme",
    "settings.theme.light": "Light",
    "settings.theme.dark": "Dark",
    "settings.theme.system": "System",
    "settings.language": "Language",
    "settings.save": "Save Settings",
    "settings.saving": "Saving...",
    "settings.saved": "Settings saved successfully!",
    "settings.cancel": "Cancel",

    // Notifications
    "notifications.title": "Notifications",
    "notifications.subtitle": "Choose how and when you want to be notified",
    "notifications.email": "Email Notifications",
    "notifications.email.desc": "Receive important notifications by email",
    "notifications.purchase": "Purchase Confirmation",
    "notifications.purchase.desc": "Receive email when you make a purchase",
    "notifications.payment": "Payment Status",
    "notifications.payment.desc": "Receive updates about payment status",
    "notifications.reminder": "Event Reminders",
    "notifications.reminder.desc":
      "Receive reminders before events you purchased",
    "notifications.promotions": "Promotions and Offers",
    "notifications.promotions.desc": "Receive exclusive offers and news",

    // Preferences
    "preferences.title": "Preferences",
    "preferences.subtitle": "Customize your platform experience",

    // Privacy
    "privacy.title": "Privacy and Security",
    "privacy.subtitle": "Manage your privacy settings",
    "privacy.dataSafe":
      "Your data is secure: We use encryption to protect your personal and payment information. We never share your data with third parties without your authorization.",
    "privacy.changePassword": "Change Password",
    "privacy.authComingSoon": "Authentication system will be implemented soon",

    // Quick links
    "links.profile.title": "My Profile",
    "links.profile.desc": "Edit personal information",
    "links.tickets.title": "My Tickets",
    "links.tickets.desc": "View your purchases",
    "links.events.title": "Events",
    "links.events.desc": "Explore available events",

    // Homepage
    "home.hero.badge": "Exclusive TXT Events",
    "home.hero.title": "Blue Hour",
    "home.hero.subtitle": "The greatest K-POP experience in Manaus",
    "home.hero.cta": "View Available Events",
    "home.events.title": "Featured Events",
    "home.events.subtitle": "Check out the upcoming TXT events in Manaus",
    "home.events.viewAll": "View All",
    "home.events.viewAllMobile": "View All Events",
    "home.events.none": "No events available at the moment",
    "home.events.noneDesc": "Stay tuned for new events coming soon!",
    "home.events.available": "Available",
    "home.events.soldOut": "Sold Out",
    "home.events.fromPrice": "From",
    "home.events.buy": "Buy",
    "home.events.ticketTypes": "type",
    "home.events.ticketTypesPlural": "types",
    "home.events.ofTicket": "of ticket",
    "home.events.pricesSoon": "Prices coming soon",
    "home.why.title": "Why choose Blue Hour?",
    "home.why.subtitle": "The best TXT event experience in Manaus",
    "home.why.tickets.title": "Secure Tickets",
    "home.why.tickets.desc":
      "Reliable and secure system for online ticket purchases",
    "home.why.events.title": "Exclusive Events",
    "home.why.events.desc": "Access to the best TXT events in Manaus",
    "home.why.community.title": "MOA Community",
    "home.why.community.desc":
      "Connect with other fans and live unforgettable moments",
    "home.cta.title": "Don't miss our upcoming TXT events",
    "home.cta.subtitle": "Stay updated on all exclusive Blue Hour events",
    "home.cta.button": "View All Events",

    // Errors
    "error.saveSettings": "Error saving settings",

    // Help
    "help.title": "Help Center",
    "help.subtitle": "Find answers to your questions or contact us",
    "help.search.placeholder": "Search by keywords...",
    "help.categories.all": "All",
    "help.categories.tickets": "Ticket Purchase",
    "help.categories.payment": "Payment",
    "help.categories.account": "Account & Profile",
    "help.categories.events": "Events",
    "help.categories.security": "Security",
    "help.noResults": "No questions found with the selected filters.",
    "help.guides.title": "Quick Guides",
    "help.guides.myTickets.title": "My Tickets",
    "help.guides.myTickets.desc": "Access your purchased tickets",
    "help.guides.myProfile.title": "My Profile",
    "help.guides.myProfile.desc": "Manage your information",
    "help.guides.settings.title": "Settings",
    "help.guides.settings.desc": "Adjust your preferences",
    "help.guides.viewEvents.title": "View Events",
    "help.guides.viewEvents.desc": "Explore available events",
    "help.contact.title": "Still need help?",
    "help.contact.subtitle": "Contact us through the channels below",
    "help.contact.email": "Email",
    "help.contact.emailResponse": "Response within 24h",
    "help.contact.phone": "Phone",
    "help.contact.phoneHours": "Mon-Fri, 9am to 6pm",
    "help.contact.hours": "Support Hours",
    "help.contact.hoursDesc": "Monday to Friday",
    "help.contact.hoursTime": "9am to 6pm (Manaus time)",
    "help.contact.tip": "Tip:",
    "help.contact.tipText":
      "Before contacting us, check if your question is already answered in the frequently asked questions section above. This can speed up support!",
    "help.privacy.title": "Privacy Policy",
    "help.privacy.desc":
      "Your data is protected. Learn about our privacy policy and terms of use.",
    "help.privacy.button": "View Full Policy",
    "help.terms.title": "Terms of Use",
    "help.terms.desc":
      "Read our terms and conditions before using our services.",
    "help.terms.button": "View Full Terms",

    // FAQ - Ticket Purchase
    "help.faq.tickets.howToBuy": "How do I buy tickets?",
    "help.faq.tickets.howToBuy.answer":
      "To buy tickets, navigate to the desired event page, select the ticket type and quantity, fill in your personal information, choose the payment method and complete the purchase. You will receive a confirmation code by email.",
    "help.faq.tickets.paymentMethods": "What payment methods are accepted?",
    "help.faq.tickets.paymentMethods.answer":
      "We accept PIX, Credit Card, Debit Card and Bank Slip. PIX payments are confirmed automatically within 2 minutes. For cards, confirmation is immediate. Bank slips are valid for 3 days.",
    "help.faq.tickets.multipleTickets": "Can I buy more than one ticket?",
    "help.faq.tickets.multipleTickets.answer":
      "Yes! You can buy up to 10 tickets per transaction. Just select the desired quantity at the time of purchase.",
    "help.faq.tickets.howToReceive": "How do I receive my ticket?",
    "help.faq.tickets.howToReceive.answer":
      "After payment confirmation, you will receive an email with the purchase code and ticket QR Code. You can also access your tickets in the 'My Tickets' section using your email or CPF.",

    // FAQ - Payment
    "help.faq.payment.timeToPay": "How long do I have to pay?",
    "help.faq.payment.timeToPay.answer":
      "For PIX and Card, payment must be made immediately. For Bank Slip, you have 3 calendar days from the generation date. After this period, the slip expires and you will need to make a new purchase.",
    "help.faq.payment.notConfirmed":
      "My payment was not confirmed, what should I do?",
    "help.faq.payment.notConfirmed.answer":
      "PIX payments can take up to 2 minutes to be confirmed. If after this period the payment is still pending, check if the payment was made correctly. For cards, contact us if there are problems. For bank slips, verify that payment was made within the validity period.",
    "help.faq.payment.cancel": "Can I cancel a purchase?",
    "help.faq.payment.cancel.answer":
      "Cancellations can be requested through our support. The refund will follow our cancellation policy, which varies according to the proximity of the event date. Contact us for more information.",

    // FAQ - Account & Profile
    "help.faq.account.needAccount": "Do I need to create an account to buy?",
    "help.faq.account.needAccount.answer":
      "You don't need to create an account. You can buy tickets by providing your personal information. However, when making a purchase, your data is saved and you can access your tickets using your email or CPF in the 'My Tickets' section.",
    "help.faq.account.accessTickets": "How do I access my tickets?",
    "help.faq.account.accessTickets.answer":
      "Access the 'My Tickets' section in the menu and enter your email or CPF used in the purchase. You will see all your purchases and can view details, QR Codes and payment codes when needed.",
    "help.faq.account.updateData": "How do I update my personal data?",
    "help.faq.account.updateData.answer":
      "Access the 'My Profile' section in the menu, enter your email or CPF to search for your profile, and then you can edit your personal information such as name, phone and CPF.",

    // FAQ - Events
    "help.faq.events.whereToSee": "Where can I see available events?",
    "help.faq.events.whereToSee.answer":
      "On the home page you will find featured events. To see all available events, access the 'Events' section in the main menu or use the search bar to find specific events.",
    "help.faq.events.soldOut": "Can tickets sell out?",
    "help.faq.events.soldOut.answer":
      "Yes, each ticket type has a limited quantity. We recommend making the purchase as soon as tickets are available to ensure your participation in the event.",

    // FAQ - Security
    "help.faq.security.dataSafe": "Is my data safe?",
    "help.faq.security.dataSafe.answer":
      "Yes! We use encryption to protect all personal and payment information. We never share your data with third parties without your authorization. For more information, see our privacy policy.",
    "help.faq.security.lostCode":
      "What should I do if I lose my purchase code?",
    "help.faq.security.lostCode.answer":
      "Don't worry! You can access your tickets at any time in the 'My Tickets' section using your email or CPF. All your tickets and codes will be available there.",

    // My Tickets
    "tickets.title": "My Tickets",
    "tickets.subtitle": "Check your purchases by entering your email or CPF",
    "tickets.search.title": "Search My Purchases",
    "tickets.search.subtitle": "Enter your email or CPF to view your tickets",
    "tickets.search.email": "Email",
    "tickets.search.emailPlaceholder": "your@email.com",
    "tickets.search.cpf": "CPF",
    "tickets.search.cpfPlaceholder": "000.000.000-00",
    "tickets.search.button": "Search Tickets",
    "tickets.search.loading": "Searching...",
    "tickets.search.error": "Please enter your email or CPF",
    "tickets.search.errorFetch": "Error searching your purchases",
    "tickets.search.errorRetry":
      "Error searching your purchases. Please try again.",
    "tickets.greeting": "Hello, {name}!",
    "tickets.found": "We found {count} purchase(s)",
    "tickets.status.cancelled": "Cancelled",
    "tickets.status.confirmed": "Confirmed",
    "tickets.status.processing": "Processing",
    "tickets.status.expired": "Expired",
    "tickets.status.pending": "Awaiting Payment",
    "tickets.details.title": "Purchase Details",
    "tickets.details.code": "Code:",
    "tickets.details.ticketType": "Ticket Type:",
    "tickets.details.quantity": "Quantity:",
    "tickets.details.quantityUnit": "ticket(s)",
    "tickets.details.unitPrice": "Unit Price:",
    "tickets.details.paymentMethod": "Payment Method:",
    "tickets.details.total": "Total:",
    "tickets.details.purchaseDate": "Purchase made on {date}",
    "tickets.actions.title": "Actions",
    "tickets.actions.viewPix": "View PIX QR Code",
    "tickets.actions.viewBarcode": "View Barcode",
    "tickets.actions.download": "Download Ticket",
    "tickets.actions.viewDetails": "View Full Details",
    "tickets.actions.downloadSoon": "QR Code download coming soon!",
    "tickets.pending.warning": "Attention:",
    "tickets.pending.message":
      "Your payment is still pending. After confirmation, you will receive your ticket by email.",
    "tickets.pastEvent.message":
      "This event has already happened. Thank you for participating!",
    "tickets.none.title": "No purchases found for this customer.",
    "tickets.none.button": "View Available Events",
    "tickets.payment.pix": "PIX",
    "tickets.payment.creditCard": "Credit Card",
    "tickets.payment.debitCard": "Debit Card",
    "tickets.payment.bankSlip": "Bank Slip",

    // My Profile
    "profile.title": "My Profile",
    "profile.subtitle": "Manage your personal information and account data",
    "profile.access.title": "Access Profile",
    "profile.access.subtitle": "Enter your email or CPF to access your profile",
    "profile.access.email": "Email",
    "profile.access.emailPlaceholder": "your@email.com",
    "profile.access.cpf": "CPF",
    "profile.access.cpfPlaceholder": "000.000.000-00",
    "profile.access.button": "Access Profile",
    "profile.access.loading": "Searching...",
    "profile.access.error": "Please enter your email or CPF",
    "profile.access.errorFetch": "Error searching profile",
    "profile.access.errorRetry": "Error searching profile. Please try again.",
    "profile.edit.title": "Edit Information",
    "profile.edit.subtitle": "Update your personal information",
    "profile.edit.name": "Full Name",
    "profile.edit.namePlaceholder": "Your full name",
    "profile.edit.email": "Email",
    "profile.edit.emailPlaceholder": "your@email.com",
    "profile.edit.emailDisabled": "Email cannot be changed",
    "profile.edit.phone": "Phone",
    "profile.edit.phonePlaceholder": "(00) 00000-0000",
    "profile.edit.cpf": "CPF",
    "profile.edit.cpfPlaceholder": "000.000.000-00",
    "profile.edit.save": "Save Changes",
    "profile.edit.saving": "Saving...",
    "profile.edit.success": "Profile updated successfully!",
    "profile.edit.error": "Error updating profile",
    "profile.edit.errorRetry": "Error updating profile. Please try again.",
    "profile.edit.searchOther": "Search Another Profile",
    "profile.info.totalPurchases": "Total Purchases",
    "profile.info.memberSince": "Member since {date}",
    "profile.links.tickets.title": "My Tickets",
    "profile.links.tickets.desc": "View all your purchases",
    "profile.links.settings.title": "Settings",
    "profile.links.settings.desc": "Preferences and notifications",
    "profile.validation.nameMin": "Name must have at least 2 characters",
    "profile.validation.emailInvalid": "Invalid email",
    "profile.validation.cpfInvalid": "Invalid CPF",
    "profile.validation.cpfLength": "CPF must have 11 digits",

    // Error and success messages
    "error.generic": "An error occurred. Please try again.",
    "error.network": "Connection error. Check your internet.",
    "error.validation": "Invalid data. Check the fields.",
    "error.rateLimit": "Too many attempts. Please wait a moment.",
    "error.unauthorized": "Unauthorized access.",
    "error.notFound": "Resource not found.",
    "success.saved": "Saved successfully!",
    "success.updated": "Updated successfully!",
    "success.deleted": "Deleted successfully!",
    "success.created": "Created successfully!",
    "success.action": "Action completed successfully!",

    // Confirmations
    "confirm.delete": "Are you sure you want to delete?",
    "confirm.cancel": "Are you sure you want to cancel?",
    "confirm.action": "Are you sure you want to perform this action?",
    "confirm.irreversible": "This action cannot be undone.",
  },
  "es-ES": {
    // Navegación
    "nav.home": "Inicio",
    "nav.events": "Eventos",
    "nav.tickets": "Mis Entradas",
    "nav.profile": "Mi Perfil",
    "nav.settings": "Configuración",
    "nav.notifications": "Notificaciones",
    "nav.admin": "Admin",
    "nav.logout": "Salir",
    "nav.search.placeholder": "Buscar eventos...",
    "nav.user": "Usuario",
    "nav.switchAccount": "Cambiar de Cuenta",
    "nav.help": "Ayuda",

    // Footer
    "footer.description":
      "Comisión de eventos especializada en traer experiencias exclusivas de {brand} a Manaus. Eventos cuidadosamente curados para crear momentos mágicos e inolvidables.",
    "footer.quickLinks": "Enlaces Rápidos",
    "footer.about": "Sobre Nosotros",
    "footer.admin": "Área Admin",
    "footer.contact": "Contacto",
    "footer.location": "Manaus, AM",
    "footer.email": "contato@bluehour.com.br",
    "footer.exclusive": "Eventos Exclusivos",
    "footer.copyright":
      "© {year} Blue Hour - Comisión de Eventos. Todos los derechos reservados.",

    // Configuración
    "settings.title": "Configuración",
    "settings.subtitle": "Gestiona tus preferencias y configuración de cuenta",
    "settings.theme": "Tema",
    "settings.theme.light": "Claro",
    "settings.theme.dark": "Oscuro",
    "settings.theme.system": "Sistema",
    "settings.language": "Idioma",
    "settings.save": "Guardar Configuración",
    "settings.saving": "Guardando...",
    "settings.saved": "¡Configuración guardada con éxito!",
    "settings.cancel": "Cancelar",

    // Notificaciones
    "notifications.title": "Notificaciones",
    "notifications.subtitle": "Elige cómo y cuándo quieres ser notificado",
    "notifications.email": "Notificaciones por Email",
    "notifications.email.desc": "Recibe notificaciones importantes por email",
    "notifications.purchase": "Confirmación de Compra",
    "notifications.purchase.desc": "Recibe email cuando realices una compra",
    "notifications.payment": "Estado de Pago",
    "notifications.payment.desc":
      "Recibe actualizaciones sobre el estado del pago",
    "notifications.reminder": "Recordatorios de Eventos",
    "notifications.reminder.desc":
      "Recibe recordatorios antes de los eventos que compraste",
    "notifications.promotions": "Promociones y Ofertas",
    "notifications.promotions.desc": "Recibe ofertas exclusivas y novedades",

    // Preferencias
    "preferences.title": "Preferencias",
    "preferences.subtitle": "Personaliza tu experiencia en la plataforma",

    // Privacidad
    "privacy.title": "Privacidad y Seguridad",
    "privacy.subtitle": "Gestiona tu configuración de privacidad",
    "privacy.dataSafe":
      "Tus datos están seguros: Utilizamos cifrado para proteger tu información personal y de pago. Nunca compartimos tus datos con terceros sin tu autorización.",
    "privacy.changePassword": "Cambiar Contraseña",
    "privacy.authComingSoon":
      "El sistema de autenticación se implementará pronto",

    // Enlaces rápidos
    "links.profile.title": "Mi Perfil",
    "links.profile.desc": "Editar información personal",
    "links.tickets.title": "Mis Entradas",
    "links.tickets.desc": "Ver tus compras",
    "links.events.title": "Eventos",
    "links.events.desc": "Explorar eventos disponibles",

    // Página de inicio
    "home.hero.badge": "Eventos Exclusivos TXT",
    "home.hero.title": "Blue Hour",
    "home.hero.subtitle": "La mayor experiencia de K-POP en Manaus",
    "home.hero.cta": "Ver Eventos Disponibles",
    "home.events.title": "Eventos Destacados",
    "home.events.subtitle": "Consulta los próximos eventos de TXT en Manaus",
    "home.events.viewAll": "Ver Todos",
    "home.events.viewAllMobile": "Ver Todos los Eventos",
    "home.events.none": "No hay eventos disponibles en este momento",
    "home.events.noneDesc":
      "¡Mantente atento para nuevos eventos próximamente!",
    "home.events.available": "Disponible",
    "home.events.soldOut": "Agotado",
    "home.events.fromPrice": "Desde",
    "home.events.buy": "Comprar",
    "home.events.ticketTypes": "tipo",
    "home.events.ticketTypesPlural": "tipos",
    "home.events.ofTicket": "de entrada",
    "home.events.pricesSoon": "Precios próximamente",
    "home.why.title": "¿Por qué elegir Blue Hour?",
    "home.why.subtitle": "La mejor experiencia de eventos TXT en Manaus",
    "home.why.tickets.title": "Entradas Seguras",
    "home.why.tickets.desc":
      "Sistema confiable y seguro para compra de entradas online",
    "home.why.events.title": "Eventos Exclusivos",
    "home.why.events.desc": "Acceso a los mejores eventos de TXT en Manaus",
    "home.why.community.title": "Comunidad MOA",
    "home.why.community.desc":
      "Conéctate con otros fans y vive momentos inolvidables",
    "home.cta.title": "No te pierdas nuestros próximos eventos TXT",
    "home.cta.subtitle":
      "Mantente al día con todos los eventos exclusivos de Blue Hour",
    "home.cta.button": "Ver Todos los Eventos",

    // Errores
    "error.saveSettings": "Error al guardar configuración",

    // Ayuda
    "help.title": "Centro de Ayuda",
    "help.subtitle": "Encuentra respuestas a tus preguntas o contáctanos",
    "help.search.placeholder": "Buscar por palabras clave...",
    "help.categories.all": "Todos",
    "help.categories.tickets": "Compra de Entradas",
    "help.categories.payment": "Pago",
    "help.categories.account": "Cuenta y Perfil",
    "help.categories.events": "Eventos",
    "help.categories.security": "Seguridad",
    "help.noResults":
      "No se encontraron preguntas con los filtros seleccionados.",
    "help.guides.title": "Guías Rápidas",
    "help.guides.myTickets.title": "Mis Entradas",
    "help.guides.myTickets.desc": "Accede a tus entradas compradas",
    "help.guides.myProfile.title": "Mi Perfil",
    "help.guides.myProfile.desc": "Gestiona tu información",
    "help.guides.settings.title": "Configuración",
    "help.guides.settings.desc": "Ajusta tus preferencias",
    "help.guides.viewEvents.title": "Ver Eventos",
    "help.guides.viewEvents.desc": "Explora eventos disponibles",
    "help.contact.title": "¿Aún necesitas ayuda?",
    "help.contact.subtitle":
      "Contáctanos a través de los canales a continuación",
    "help.contact.email": "Email",
    "help.contact.emailResponse": "Respuesta en hasta 24h",
    "help.contact.phone": "Teléfono",
    "help.contact.phoneHours": "Lun-Vie, 9h a 18h",
    "help.contact.hours": "Horario de Atención",
    "help.contact.hoursDesc": "Lunes a Viernes",
    "help.contact.hoursTime": "9h a 18h (hora de Manaus)",
    "help.contact.tip": "Consejo:",
    "help.contact.tipText":
      "Antes de contactarnos, verifica si tu pregunta ya está respondida en la sección de preguntas frecuentes arriba. ¡Esto puede agilizar la atención!",
    "help.privacy.title": "Política de Privacidad",
    "help.privacy.desc":
      "Tus datos están protegidos. Conoce nuestra política de privacidad y términos de uso.",
    "help.privacy.button": "Ver Política Completa",
    "help.terms.title": "Términos de Uso",
    "help.terms.desc":
      "Lee nuestros términos y condiciones antes de utilizar nuestros servicios.",
    "help.terms.button": "Ver Términos Completos",

    // FAQ - Compra de Entradas
    "help.faq.tickets.howToBuy": "¿Cómo compro entradas?",
    "help.faq.tickets.howToBuy.answer":
      "Para comprar entradas, navega hasta la página del evento deseado, selecciona el tipo de entrada y la cantidad, completa tus datos personales, elige la forma de pago y finaliza la compra. Recibirás un código de confirmación por email.",
    "help.faq.tickets.paymentMethods": "¿Qué formas de pago se aceptan?",
    "help.faq.tickets.paymentMethods.answer":
      "Aceptamos PIX, Tarjeta de Crédito, Tarjeta de Débito y Boleto Bancario. El pago vía PIX se confirma automáticamente en hasta 2 minutos. Para tarjetas, la confirmación es inmediata. Los boletos tienen validez de 3 días.",
    "help.faq.tickets.multipleTickets": "¿Puedo comprar más de una entrada?",
    "help.faq.tickets.multipleTickets.answer":
      "¡Sí! Puedes comprar hasta 10 entradas por transacción. Solo selecciona la cantidad deseada en el momento de la compra.",
    "help.faq.tickets.howToReceive": "¿Cómo recibo mi entrada?",
    "help.faq.tickets.howToReceive.answer":
      "Después de la confirmación del pago, recibirás un email con el código de compra y el código QR de la entrada. También puedes acceder a tus entradas en la sección 'Mis Entradas' usando tu email o CPF.",

    // FAQ - Pago
    "help.faq.payment.timeToPay": "¿Cuánto tiempo tengo para pagar?",
    "help.faq.payment.timeToPay.answer":
      "Para PIX y Tarjeta, el pago debe realizarse inmediatamente. Para Boleto, tienes 3 días corridos a partir de la fecha de generación. Después de este período, el boleto expira y necesitarás realizar una nueva compra.",
    "help.faq.payment.notConfirmed": "Mi pago no fue confirmado, ¿qué hacer?",
    "help.faq.payment.notConfirmed.answer":
      "Los pagos vía PIX pueden tardar hasta 2 minutos en confirmarse. Si después de este período el pago aún está pendiente, verifica si el pago se realizó correctamente. Para tarjetas, contáctanos si hay problemas. Para boletos, verifica que el pago se haya realizado dentro del plazo de validez.",
    "help.faq.payment.cancel": "¿Puedo cancelar una compra?",
    "help.faq.payment.cancel.answer":
      "Las cancelaciones pueden solicitarse a través de nuestro soporte. El reembolso seguirá nuestra política de cancelación, que varía según la proximidad de la fecha del evento. Contáctanos para más información.",

    // FAQ - Cuenta y Perfil
    "help.faq.account.needAccount": "¿Necesito crear una cuenta para comprar?",
    "help.faq.account.needAccount.answer":
      "No es necesario crear una cuenta. Puedes comprar entradas proporcionando tus datos personales. Sin embargo, al hacer una compra, tus datos se guardan y puedes acceder a tus entradas usando tu email o CPF en la sección 'Mis Entradas'.",
    "help.faq.account.accessTickets": "¿Cómo accedo a mis entradas?",
    "help.faq.account.accessTickets.answer":
      "Accede a la sección 'Mis Entradas' en el menú e ingresa tu email o CPF usado en la compra. Verás todas tus compras y podrás visualizar los detalles, códigos QR y códigos de pago cuando sea necesario.",
    "help.faq.account.updateData": "¿Cómo actualizo mis datos personales?",
    "help.faq.account.updateData.answer":
      "Accede a la sección 'Mi Perfil' en el menú, ingresa tu email o CPF para buscar tu perfil, y luego podrás editar tu información personal como nombre, teléfono y CPF.",

    // FAQ - Eventos
    "help.faq.events.whereToSee": "¿Dónde puedo ver los eventos disponibles?",
    "help.faq.events.whereToSee.answer":
      "En la página de inicio encontrarás los eventos destacados. Para ver todos los eventos disponibles, accede a la sección 'Eventos' en el menú principal o usa la barra de búsqueda para encontrar eventos específicos.",
    "help.faq.events.soldOut": "¿Las entradas pueden agotarse?",
    "help.faq.events.soldOut.answer":
      "Sí, cada tipo de entrada tiene una cantidad limitada. Recomendamos realizar la compra tan pronto como las entradas estén disponibles para garantizar tu participación en el evento.",

    // FAQ - Seguridad
    "help.faq.security.dataSafe": "¿Mis datos están seguros?",
    "help.faq.security.dataSafe.answer":
      "¡Sí! Utilizamos cifrado para proteger toda la información personal y de pago. Nunca compartimos tus datos con terceros sin tu autorización. Para más información, consulta nuestra política de privacidad.",
    "help.faq.security.lostCode": "¿Qué hacer si pierdo mi código de compra?",
    "help.faq.security.lostCode.answer":
      "¡No te preocupes! Puedes acceder a tus entradas en cualquier momento en la sección 'Mis Entradas' usando tu email o CPF. Todas tus entradas y códigos estarán disponibles allí.",

    // Mis Entradas
    "tickets.title": "Mis Entradas",
    "tickets.subtitle": "Consulta tus compras ingresando tu email o CPF",
    "tickets.search.title": "Buscar Mis Compras",
    "tickets.search.subtitle": "Ingresa tu email o CPF para ver tus entradas",
    "tickets.search.email": "Email",
    "tickets.search.emailPlaceholder": "tu@email.com",
    "tickets.search.cpf": "CPF",
    "tickets.search.cpfPlaceholder": "000.000.000-00",
    "tickets.search.button": "Buscar Entradas",
    "tickets.search.loading": "Buscando...",
    "tickets.search.error": "Por favor, ingresa tu email o CPF",
    "tickets.search.errorFetch": "Error al buscar tus compras",
    "tickets.search.errorRetry":
      "Error al buscar tus compras. Intenta nuevamente.",
    "tickets.greeting": "¡Hola, {name}!",
    "tickets.found": "Encontramos {count} compra(s)",
    "tickets.status.cancelled": "Cancelada",
    "tickets.status.confirmed": "Confirmada",
    "tickets.status.processing": "Procesando",
    "tickets.status.expired": "Expirada",
    "tickets.status.pending": "Esperando Pago",
    "tickets.details.title": "Detalles de la Compra",
    "tickets.details.code": "Código:",
    "tickets.details.ticketType": "Tipo de Entrada:",
    "tickets.details.quantity": "Cantidad:",
    "tickets.details.quantityUnit": "entrada(s)",
    "tickets.details.unitPrice": "Precio Unitario:",
    "tickets.details.paymentMethod": "Forma de Pago:",
    "tickets.details.total": "Total:",
    "tickets.details.purchaseDate": "Compra realizada el {date}",
    "tickets.actions.title": "Acciones",
    "tickets.actions.viewPix": "Ver Código QR PIX",
    "tickets.actions.viewBarcode": "Ver Código de Barras",
    "tickets.actions.download": "Descargar Entrada",
    "tickets.actions.viewDetails": "Ver Detalles Completos",
    "tickets.actions.downloadSoon": "¡Descarga de código QR próximamente!",
    "tickets.pending.warning": "Atención:",
    "tickets.pending.message":
      "Tu pago aún está pendiente. Después de la confirmación, recibirás tu entrada por email.",
    "tickets.pastEvent.message":
      "Este evento ya ocurrió. ¡Gracias por participar!",
    "tickets.none.title": "No se encontraron compras para este cliente.",
    "tickets.none.button": "Ver Eventos Disponibles",
    "tickets.payment.pix": "PIX",
    "tickets.payment.creditCard": "Tarjeta de Crédito",
    "tickets.payment.debitCard": "Tarjeta de Débito",
    "tickets.payment.bankSlip": "Boleto Bancario",

    // Mi Perfil
    "profile.title": "Mi Perfil",
    "profile.subtitle": "Gestiona tu información personal y datos de cuenta",
    "profile.access.title": "Acceder al Perfil",
    "profile.access.subtitle":
      "Ingresa tu email o CPF para acceder a tu perfil",
    "profile.access.email": "Email",
    "profile.access.emailPlaceholder": "tu@email.com",
    "profile.access.cpf": "CPF",
    "profile.access.cpfPlaceholder": "000.000.000-00",
    "profile.access.button": "Acceder al Perfil",
    "profile.access.loading": "Buscando...",
    "profile.access.error": "Por favor, ingresa tu email o CPF",
    "profile.access.errorFetch": "Error al buscar perfil",
    "profile.access.errorRetry": "Error al buscar perfil. Intenta nuevamente.",
    "profile.edit.title": "Editar Información",
    "profile.edit.subtitle": "Actualiza tu información personal",
    "profile.edit.name": "Nombre Completo",
    "profile.edit.namePlaceholder": "Tu nombre completo",
    "profile.edit.email": "Email",
    "profile.edit.emailPlaceholder": "tu@email.com",
    "profile.edit.emailDisabled": "El email no puede ser cambiado",
    "profile.edit.phone": "Teléfono",
    "profile.edit.phonePlaceholder": "(00) 00000-0000",
    "profile.edit.cpf": "CPF",
    "profile.edit.cpfPlaceholder": "000.000.000-00",
    "profile.edit.save": "Guardar Cambios",
    "profile.edit.saving": "Guardando...",
    "profile.edit.success": "¡Perfil actualizado con éxito!",
    "profile.edit.error": "Error al actualizar perfil",
    "profile.edit.errorRetry":
      "Error al actualizar perfil. Intenta nuevamente.",
    "profile.edit.searchOther": "Buscar Otro Perfil",
    "profile.info.totalPurchases": "Total de Compras",
    "profile.info.memberSince": "Miembro desde {date}",
    "profile.links.tickets.title": "Mis Entradas",
    "profile.links.tickets.desc": "Ver todas tus compras",
    "profile.links.settings.title": "Configuración",
    "profile.links.settings.desc": "Preferencias y notificaciones",
    "profile.validation.nameMin": "El nombre debe tener al menos 2 caracteres",
    "profile.validation.emailInvalid": "Email inválido",
    "profile.validation.cpfInvalid": "CPF inválido",
    "profile.validation.cpfLength": "El CPF debe tener 11 dígitos",

    // Mensajes de error y éxito
    "error.generic": "Ocurrió un error. Intenta nuevamente.",
    "error.network": "Error de conexión. Verifica tu internet.",
    "error.validation": "Datos inválidos. Verifica los campos.",
    "error.rateLimit": "Demasiados intentos. Espera un momento.",
    "error.unauthorized": "Acceso no autorizado.",
    "error.notFound": "Recurso no encontrado.",
    "success.saved": "¡Guardado con éxito!",
    "success.updated": "¡Actualizado con éxito!",
    "success.deleted": "¡Eliminado con éxito!",
    "success.created": "¡Creado con éxito!",
    "success.action": "¡Acción completada con éxito!",

    // Confirmaciones
    "confirm.delete": "¿Estás seguro de que deseas eliminar?",
    "confirm.cancel": "¿Estás seguro de que deseas cancelar?",
    "confirm.action": "¿Estás seguro de que deseas realizar esta acción?",
    "confirm.irreversible": "Esta acción no se puede deshacer.",
  },
};

// Hook para usar traduções
export function useTranslations(locale: Locale) {
  return function t(key: string): string {
    return translations[locale]?.[key] || key;
  };
}

// Função helper para obter tradução
export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] || key;
}
