import { supabase } from './supabase';

export async function testConnection() {
  try {
    // Tenta buscar as categorias (que são públicas)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Erro ao conectar com o Supabase:', error.message);
      return false;
    }

    console.log('Conexão com o Supabase estabelecida com sucesso!');
    console.log('Dados de teste:', data);
    return true;
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    return false;
  }
} 