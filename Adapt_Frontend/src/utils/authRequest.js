export const getAuthHeaders = async (getToken, refresh = false) => {
  const token = await getToken(refresh ? { skipCache: true } : undefined);

  if (!token) {
    throw new Error("Usuario nao autenticado");
  }

  return { Authorization: `Bearer ${token}` };
};

export const requestWithAuth = async (getToken, request) => {
  try {
    return await request(await getAuthHeaders(getToken));
  } catch (error) {
    if (error?.response?.status === 401) {
      return request(await getAuthHeaders(getToken, true));
    }

    throw error;
  }
};
