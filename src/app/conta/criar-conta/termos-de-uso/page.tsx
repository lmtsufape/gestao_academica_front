
"use client"
import { useEffect, useState } from 'react';
import '../../auth-styles.css';

export default function PageRegister() {
    const [isPopup, setIsPopup] = useState<boolean>(false);

    useEffect(() => {
        function checkIfPopup() {
            if (typeof window !== 'undefined') {
                const hasOpener = !!window.opener;
                const isSmallWindow = window.innerWidth < 600 && window.innerHeight < 600;
                return hasOpener || isSmallWindow;
            }

            return false;
        }

        setIsPopup(checkIfPopup());

        if (typeof window !== 'undefined') {
            const hash = window.location.hash;
            if (hash) {
                // Pequeno delay para garantir que o DOM esteja totalmente carregado
                setTimeout(() => {
                    const element = document.querySelector(hash);
                    if (element) {
                        // Calcular a posição com offset
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset + 1300; // 100px de offset

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        }
    }, []);

    const closePopup = () => {
        if (window.opener) {
            window.close();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 pt-10">
            <div className="w-full max-w-[110em] p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow">
                <h3 id="aviso-de-privacidade" className="text-2xl font-bold custom-text-color dark:text-white text-white text-center">
                    TERMOS DE USO
                </h3>
                <div className="container">
                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">1. Introdução</p>
                    <p>Bem-vindo aos termos de uso da Sistema de Gestão Universitária. Estes termos regem o uso do nosso aplicativo web.</p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">2. Aceitação do Termo de Uso e Política de Privacidade</p>
                    <p>2.1 - Ao utilizar o Sistema de Gestão Universitária, o usuário confirma que leu, compreendeu e que aceita os termos e políticas aplicáveis e fica a eles vinculado.</p>
                    <p>2.2 - Caso não concorde com as regras presentes nestes Termos, o Usuário não poderá acessar e utilizar o sistema e dispor dos seus serviços.   .</p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">3. Legislação Aplicada</p>
                    <p>Elencamos abaixo leis e normativos que você pode consultar para esclarecer dúvidas relacionadas aos serviços que envolvam tratamento dos dados, transparência na administração pública, direito dos titulares, entre outros:</p>
                    <p>
                        3.1 - <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Lei nº 13.709, de 14 de agosto de 2018:
                        </a> Lei Geral de Proteção de Dados Pessoais (LGPD);
                    </p>
                    <p>
                        3.2 - <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13460.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Lei nº 13.460, de 26 de junho de 2017:
                        </a> dispõe sobre participação, proteção e defesa dos direitos do usuário dos serviços públicos da administração pública.
                    </p>
                    <p>
                        3.3 - <a href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l12965.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Lei nº 12.965, de 23 de abril de 2014 (Marco Civil da Internet):
                        </a> estabelece princípios, garantias, direitos e deveres para o uso da Internet no Brasil.
                    </p>
                    <p>
                        3.4 - <a href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Lei nº 12.527, de 18 de novembro de 2011 (Lei de Acesso à Informação):
                        </a> regula o acesso a informações previsto na Constituição Federal.
                    </p>
                    <p>
                        3.5 - <a href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/decreto/d7724.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Decreto nº 7.724, de 16 de maio de 2012:
                        </a> regulamenta a Lei de Acesso à informação.

                    </p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">4. Uso do Aplicativo</p>
                    <p>O uso deste aplicativo está sujeito aos seguintes termos, ora explicitados abaixo:</p>
                    <p>4.1 - Os dados que compõe o sistema são de uso da Universidade Federal do Agreste de Pernambuco e das pró-reitorias que a compõem.</p>
                    <p>4.2 - As informações e os dados do sistema podem ser modificados sem aviso prévio ao usuário.</p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">5. Direitos do Usuário</p>
                    <p>5.1 - Confirmação e acesso: É o direito de obter a conﬁrmação de quais dados pessoais são ou não objeto de tratamento e, se for esse o caso, o direito de acessar os seus dados pessoais.</p>
                    <p>5.2 - Retificação: É o direito de solicitar a correção de dados incompletos, inexatos ou desatualizados. (art. 18, III)</p>
                    <p>5.3 - Limitação do tratamento dos dados: É o direito de limitar o tratamento de seus dados pessoais, podendo exigir a eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a Lei Geral de Proteção de Dados.</p>
                    <p>5.4 - Oposição: É o direito de, a qualquer momento, se opor ao tratamento de dados por motivos relacionados com a sua situação particular, em caso de descumprimento ao disposto na Lei Geral de Proteção de Dados.</p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">6. Deveres do Usuário</p>
                    <p>6.1 - Veracidade das informações: Caso os dados informados não possuam veracidade e precisão, pode ser que não consiga utilizar o serviço. Você, como usuário do serviço, é responsável pela atualização das suas informações pessoais e pelas consequências na omissão ou erros nas informações pessoais cadastradas.</p>
                    <p>6.2 - Não compartilhamento de login e/ou senha: O login e senha só poderão ser utilizados pelo usuário cadastrado. Você deve manter sigilo da senha, que é pessoal e intransferível, não podendo alegar uso indevido, após seu compartilhamento.</p>
                    <p>6.3 - Responsabilidade pelos atos: O usuário é responsável pela reparação de todos e quaisquer danos, diretos ou indiretos (inclusive decorrentes do desrespeito de quaisquer direitos de outros usuários, de terceiros, inclusive direitos de propriedade intelectual, de segredo e de personalidade), que sejam causados à Administração Pública, a qualquer outro usuário, ou, ainda, a qualquer terceiro, inclusive no ato do descumprimento do estabelecido nestes Termos de Uso ou de qualquer ato praticado a partir de seu acesso ao serviço.</p>
                    <p>6.4 - Não interferir, comprometer ou interromper o serviço: Vale também em relação a servidores ou redes conectadas ao serviço, por meio da transmissão de qualquer malware, worm, vírus, spyware ou outro código malicioso. Você não pode inserir conteúdo ou códigos ou, de outra forma, alterar ou interferir na maneira como a página do serviço é exibida ou processada no dispositivo do usuário. Tendo em vista que o serviço lida com informações pessoais, você, como usuário, concorda que não usará robôs, sistemas de varredura e armazenamento de dados (como “spiders” ou “scrapers”), links escondidos ou qualquer outro recurso escuso, ferramenta, programa, algoritmo ou método coletor/extrator de dados automático para acessar, adquirir, copiar ou monitorar o serviço, sem permissão expressa por escrito da Universidade Federal do Agreste de Pernambuco.</p>
                    <p>6.5 - Insenção de responsabilidade da administração pública: A Universidade Federal do Agreste de Pernambuco não poderá ser responsabilizada por: equipamento infetado ou invadido por atacantes, equipamento danificado no momento do consumo dos serviços, proteção do computador,
                        proteção das informações baseadas nos computadores dos usuários, abuso de uso dos computadores dos usuários, monitoração ilegal do computador dos usuários, vulnerabilidades ou instabilidades existentes nos sistemas dos usuários, perímetro inseguro.
                    </p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">7. Responsabilidade da Administração Pública com os Dados Pessoais</p>
                    <p>7.1 - A Administração Pública se compromete em cumprir todas as legislações relativas ao uso correto dos dados pessoais do cidadão, bem como a garantir todos os direitos e garantias legais dos usuários. Ela também se obriga a promover, independentemente de solicitações, a divulgação em local de fácil acesso, no âmbito de suas competências, de informações de interesse coletivo ou geral produzidas ou custodiadas. É de responsabilidade da Administração Pública implementar controles de segurança para proteção dos dados pessoais dos usuários.</p>
                    <p>7.2 - A Administração Pública poderá, quanto às ordens judiciais de pedido das informações, compartilhar informações necessárias para investigações ou tomar medidas relacionadas a atividades ilegais, suspeitas de fraude ou ameaças potenciais contra pessoas, bens ou sistemas que sustentam o Serviço ou de outra forma necessária para cumprir com nossas obrigações legais. Caso ocorra, a Administração Pública notificará os usuários, salvo quando o processo estiver em segredo de justiça.</p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">8. Links</p>
                    <p>Este sistema pode conter links para outros sites que não são mantidos ou controlados pela Universidade Federal do Agreste de Pernambuco. A Universidade não possui controle sobre o conteúdo, políticas de privacidade ou práticas de sites de terceiros, não assumindo quaisquer responsabilidades sobre estes.</p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">9. Alterações dos Termos de Uso</p>
                    <p>A Universidade Federal do Agreste de Pernambuco poderá revisar e atualizar estes termos de uso e de privacidade a qualquer momento, ficando o usuário vinculado à versão atualizada desses termos.</p>
                    <br></br>

                </div>

                <h3 className="text-2xl font-bold custom-text-color dark:text-white text-white text-center">
                    AVISO DE PRIVACIDADE
                </h3>
                <div>
                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">1. Introdução</p>
                    <p>Bem-vindo ao avido de privacidade do Sistema de Gestão Universitária. Estes termos regem o uso do nosso aplicativo web.</p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">2. Aceitação da Política de Privacidade</p>
                    <p>2.1 - Ao utilizar o Sistema de Gestão Universitária, o usuário confirma que leu, compreendeu e que aceita os termos e políticas aplicáveis e fica a eles vinculado.</p>
                    <p>2.2 - Caso não concorde com as regras presentes nestes Termos, o Usuário não poderá acessar e utilizar o sistema e dispor dos seus serviços.   .</p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">3. Legislação Aplicada</p>
                    <p>Elencamos abaixo leis e normativos que você pode consultar para esclarecer dúvidas relacionadas aos serviços que envolvam tratamento dos dados, transparência na administração pública, direito dos titulares, entre outros:</p>
                    <p>
                        3.1 - <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Lei nº 13.709, de 14 de agosto de 2018:
                        </a> Lei Geral de Proteção de Dados Pessoais (LGPD);
                    </p>
                    <p>
                        3.2 - <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13460.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Lei nº 13.460, de 26 de junho de 2017:
                        </a> dispõe sobre participação, proteção e defesa dos direitos do usuário dos serviços públicos da administração pública.
                    </p>
                    <p>
                        3.3 - <a href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l12965.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Lei nº 12.965, de 23 de abril de 2014 (Marco Civil da Internet):
                        </a> estabelece princípios, garantias, direitos e deveres para o uso da Internet no Brasil.
                    </p>
                    <p>
                        3.4 - <a href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Lei nº 12.527, de 18 de novembro de 2011 (Lei de Acesso à Informação):
                        </a> regula o acesso a informações previsto na Constituição Federal.
                    </p>
                    <p>
                        3.5 - <a href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/decreto/d7724.htm" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Decreto nº 7.724, de 16 de maio de 2012:
                        </a> regulamenta a Lei de Acesso à informação.

                    </p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">4. Finalidade dos Dados Tratados</p>
                    <p>A Universidade Federal do Agreste de Pernambuco coleta dados considerados indispensáveis para o funcionamento do serviço, tais como nome, nome social, CPF, e-mail, telefones para contato, dados acadêmicos e proﬁssionais, entre outros.
                        Além disso, ao tratar os seus dados, a Universidade busca respeitar todos os princípios estabelecidos no artigo 6º e 7º, I e II da LGPD.</p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">5. Armazenamento dos Dados</p>
                    <p>5.1 - Os dados pessoais tratados pelo sistema serão utilizados e armazenados nos servidores da Universidade, durante o tempo necessário da prestação do serviço ou para que as finalidades listadas neste Aviso de Privacidade sejam atingidas, considerando os direitos
                        dos usuários e dos responsáveis pelo tratamento dos dados pessoais.
                    </p>
                    <p>5.2 - Os dados serão mantidos enquanto relevante. Após período em que os dados pessoais precisam permanecer armazenados, estes serão excluídos de nossa base de dados ou anonimizados, respeitando as hipóteses legalmente previstas no art. 16 da LGPD.</p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">6. Segurança no Tratamento dos Dados Pessoais</p>
                    <p>6.1 - A maneira como são tratados os dados pelo sistema refletem seu compromisso com a segurança e proteção dos dados pessoais para garantir a privacidade. São usadas medidas e soluções técnicas de proteção apropriadas para garantir a confidencialidade, integridade e inviolabilidade dos dados pessoais. Para manter os dados pessoais protegidos, são usadas ferramentas físicas, eletrônicas e gerenciais direcionadas para a proteção e privacidade.</p>
                    <p>6.2 - A aplicação dessas ferramentas leva em consideração a natureza dos dados pessoais tratados, o contexto e a finalidade do tratamento e os riscos que eventuais violações gerariam para os direitos e liberdades do titular dos dados.</p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">7. Compartilhamento de dados</p>
                    <p>7.1 - Tendo em vista a preservação de privacidade, o portal gov.br não compartilhará dados pessoais com nenhum terceiro não autorizado, salvo por:</p>
                    <p>7.1.1 - Determinação legal, requirimento, requisição ou ordem judicial, com autoridades judiciais, administrativas ou governamentais competentes.</p>
                    <p>7.1.2 - Proteção dos direitos da Universidade Federal do Agreste de Pernambuco ou do Sistema de Gestão Universitária em qualquer tipo de conflito, inclusive os de teor judicial.</p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">8. Alterações deste Aviso de Privacidade</p>
                    <p>8.1 - O editor se reserva o direito de modificar, a qualquer momento as presentes normas, especialmente para adaptá-las às melhorias do serviço, seja pela disponibilização de novas funcionalidades, seja pela retirada ou modificação daquelas já existentes.</p>
                    <p>8.2 - Qualquer alteração ou atualização do Termo de Uso ou do Aviso de Privacidade passará a valer a partir da data de sua publicação no site do serviço e deverá ser integralmente observada pelos usuários.</p>
                    <p>8.3 - Nos casos em que as alterações ou atualizações do Aviso de Privacidade relacionarem-se à finalidade, forma e duração do tratamento, mudança do(s) controlador(es) ou uso compartilhado dos dados, o titular de dados será informado a respeito, sendo-lhe permitido revogar seu consentimento, caso discorde do teor das alterações.</p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">9. Responsabilidade</p>
                    <p>O Sistema de Gestão Universitária prevê a responsabilidade dos agentes que atuam nos processos de tratamento de dados, em conformidade com os arts. 42 ao 45 da LGPD.</p>
                    <p>E se compromete em manter este Aviso de Privacidade atualizado, observando suas determinações e zelando por seu cumprimento. Além disso, também assume o compromisso de buscar condições técnicas e organizacionais aptas a proteger todo o processo de tratamento de dados.</p>
                    <br></br>

                    <p className="text-[1.3em] font-bold custom-text-color dark:text-white text-white text-left">10. Isenção de responsabilidade</p>
                    <p>Conforme mencionado anteriormente, embora seja adotados elevados padrões de segurança a fim de evitar incidentes, não há nenhuma página virtual inteiramente livre de rirscos. Nesse sentido, a Universidade Federal do Agreste de Pernambuco não se responsabiliza por:</p>
                    <p>I - Quaisquer consequências decorrentes do descaso ou descuido dos usuários em relação a seus dados individuais. A Universidade se responsabiliza apenas pela segurança dos processos de tratamento de dados e do cumprimento das finalidades descritas neste Aviso de Privacidade. Destaca-se ainda que a responsabilidade em relação à confidencialidade dos dados de acesso é do usuário.</p>
                    <p>II - Ações maliciosas de terceiros, como ataques cibernéticos, exceto se comprovada conduta culposa ou deliberada do Sistema de Gestão Universitária.</p>
                    <p>III - Inveracidade das informações inseridas pelo usuário nos registros necessários para a utilização dos serviços e quaisquer consequências decorrentes de informações falsas ou inseridas de má-fé são de total responsabilidade do usuário. </p>

                </div>




                {isPopup && (
                    <div className="container">
                        <a onClick={closePopup} className="custom-text-color text-sm cursor-pointer">
                            Fechar
                        </a>
                    </div>
                )}
                {/* <div className="container">
                    <Link href="/conta/criar-conta" className="custom-text-color text-sm">Voltar</Link>
                </div> */}
            </div>
        </div>
    );
}
