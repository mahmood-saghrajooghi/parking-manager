const apiURL = process.env.REACT_APP_API_URL || '';

type CLientProps = Partial<RequestInit> & {
  data?: Record<string, any> | string | any[] | number;
  token?: any;
};

async function client(endpoint: string, props: CLientProps | undefined = {}) {
  const { data, token, headers: customHeaders, ...customConfig } = props;
  const config = {
    method: data ? "POST" : "GET",
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": data ? "application/json" : undefined,
      ...customHeaders,
    } as Record<string, string>,
    ...customConfig,
  };
  

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async (response) => {
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
}

export { client };
