import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

// Definindo os endpoints para interagir com a API do usuário
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login do usuário
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`, // URL para autenticação do usuário
        method: 'POST', // Método POST para login
        body: data, // Corpo da requisição contendo os dados de login (ex: email e senha)
      }),
      // Após o login, podemos armazenar as informações do usuário
      onQueryStarted: async (data, { dispatch, queryFulfilled }) => {
        try {
          const { data: userInfo } = await queryFulfilled; // Dados do usuário após o login
          // Atualizando o estado global com os dados do usuário logado
          dispatch(apiSlice.util.updateQueryData('getUserDetails', userInfo.id, { userInfo }));
        } catch (err) {
          console.error('Erro ao armazenar dados do usuário:', err);
        }
      },
    }),

    // Registro de novo usuário
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`, // URL para registro do usuário
        method: 'POST', // Método POST para criar um novo usuário
        body: data, // Dados do novo usuário (nome, email, senha)
      }),
    }),

    // Logout do usuário
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`, // URL para realizar logout
        method: 'POST', // Método POST para logout
      }),
    }),

    // Atualizar o perfil do usuário
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`, // URL para atualizar o perfil
        method: 'PUT', // Método PUT para atualizar dados
        body: data, // Dados a serem atualizados (como nome, email, etc.)
      }),
    }),

    // Obter lista de usuários
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL, // URL para obter todos os usuários
      }),
      providesTags: ['User'], // Marca a consulta como 'User', útil para cache
      keepUnusedDataFor: 5, // Mantém o cache por 5 segundos
    }),

    // Deletar um usuário
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`, // URL para deletar um usuário específico
        method: 'DELETE', // Método DELETE para remover o usuário
      }),
      invalidatesTags: ['User'], // Invalida o cache 'User' após exclusão
    }),

    // Obter detalhes de um usuário
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`, // URL para obter detalhes de um usuário específico
      }),
      keepUnusedDataFor: 5, // Mantém o cache por 5 segundos
    }),

    // Atualizar os dados de um usuário
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`, // URL para atualizar o usuário
        method: 'PUT', // Método PUT para atualização
        body: data, // Dados a serem atualizados
      }),
      invalidatesTags: ['User'], // Invalida o cache 'User' após atualização
    }),

    // Obter uma lista de emails (apenas)
    getEmails: builder.query({
      query: () => ({
        url: `${USERS_URL}/email-list`, // URL para obter apenas a lista de emails
      }),
      keepUnusedDataFor: 5, // Mantém o cache por 5 segundos
    }),
  }),
});

// Exportando os hooks gerados para uso em componentes React
export const {
  useLoginMutation, // Hook para login
  useLogoutMutation, // Hook para logout
  useRegisterMutation, // Hook para registro
  useProfileMutation, // Hook para atualizar perfil
  useGetUsersQuery, // Hook para obter lista de usuários
  useDeleteUserMutation, // Hook para deletar um usuário
  useUpdateUserMutation, // Hook para atualizar um usuário
  useGetUserDetailsQuery, // Hook para obter detalhes de um usuário
  useGetEmailsQuery, // Hook para obter lista de emails
} = userApiSlice;
