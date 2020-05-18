import { Categories } from './categories';
import { Accounts } from './accounts';

function insertCategory(name) {
  Categories.insert({ name, createdAt: new Date() });
}
function insertAccount(name, dueDate = undefined) {
  Accounts.insert({
    name,
    createdAt: new Date(),
    dueDate,
    creditCard: !!dueDate,
  });
}
export function createAccounts() {
  if (Accounts.find().count() === 0) {
    insertAccount('Santander');
    insertAccount('Inter');
    insertAccount('Cartão Fit', 6);
    insertAccount('Cartão Free', 16);
    insertAccount('Cartão Nubank', 20);
    insertAccount('Cartão Platinum', 5);
    insertAccount('Cartão Meliuz', 5);
  }
}
export function createCategories() {
  if (Categories.find().count() === 0) {
    insertCategory('Alimentação');
    insertCategory('Restaurantes');
    insertCategory('Transporte');
    insertCategory('Trabalho');
    insertCategory('Serviços Essenciais');
    insertCategory('Lazer');
    insertCategory('Investimento');
    insertCategory('Categoria Excluída');
    insertCategory('Viagem');
    insertCategory('Vestuário');
    insertCategory('Dízimos e Ofertas');
    insertCategory('Serviços Financeiros');
    insertCategory('Saúde');
    insertCategory('Ajuste');
    insertCategory('Eletrônico');
    insertCategory('Casa');
    insertCategory('Construção');
    insertCategory('Música');
    insertCategory('Livros e Cursos');
    insertCategory('Esportes');
    insertCategory('Pet');
  }
}
