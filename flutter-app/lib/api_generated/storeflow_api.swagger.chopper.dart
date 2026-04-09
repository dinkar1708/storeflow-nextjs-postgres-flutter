// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format width=80

part of 'storeflow_api.swagger.dart';

// **************************************************************************
// ChopperGenerator
// **************************************************************************

// coverage:ignore-file
// ignore_for_file: type=lint
final class _$StoreflowApi extends StoreflowApi {
  _$StoreflowApi([ChopperClient? client]) {
    if (client == null) return;
    this.client = client;
  }

  @override
  final Type definitionType = StoreflowApi;

  @override
  Future<Response<dynamic>> _apiAdminProductsGet({
    SwaggerMetaData swaggerMetaData = const SwaggerMetaData(
      description:
          'Returns a list of all products (including inactive) for admin management. Requires ADMIN role.',
      summary: 'List all products (Admin)',
      operationId: '',
      consumes: [],
      produces: [],
      security: ["BearerAuth"],
      tags: ["Admin"],
      deprecated: false,
    ),
  }) {
    final Uri $url = Uri.parse('/api/admin/products');
    final Request $request = Request(
      'GET',
      $url,
      client.baseUrl,
      tag: swaggerMetaData,
    );
    return client.send<dynamic, dynamic>($request);
  }

  @override
  Future<Response<dynamic>> _apiAdminProductsPost({
    required ApiAdminProductsPost$RequestBody? body,
    SwaggerMetaData swaggerMetaData = const SwaggerMetaData(
      description: 'Creates a new product. Requires ADMIN role.',
      summary: 'Create new product',
      operationId: '',
      consumes: [],
      produces: [],
      security: ["BearerAuth"],
      tags: ["Admin"],
      deprecated: false,
    ),
  }) {
    final Uri $url = Uri.parse('/api/admin/products');
    final $body = body;
    final Request $request = Request(
      'POST',
      $url,
      client.baseUrl,
      body: $body,
      tag: swaggerMetaData,
    );
    return client.send<dynamic, dynamic>($request);
  }

  @override
  Future<Response<dynamic>> _apiAdminUsersIdPatch({
    required String? id,
    required ApiAdminUsersIdPatch$RequestBody? body,
    SwaggerMetaData swaggerMetaData = const SwaggerMetaData(
      description:
          'Update a user\'s role or active status. Requires ADMIN role.',
      summary: 'Update user role or status',
      operationId: '',
      consumes: [],
      produces: [],
      security: ["BearerAuth"],
      tags: ["Admin"],
      deprecated: false,
    ),
  }) {
    final Uri $url = Uri.parse('/api/admin/users/${id}');
    final $body = body;
    final Request $request = Request(
      'PATCH',
      $url,
      client.baseUrl,
      body: $body,
      tag: swaggerMetaData,
    );
    return client.send<dynamic, dynamic>($request);
  }

  @override
  Future<Response<dynamic>> _apiAdminUsersIdDelete({
    required String? id,
    SwaggerMetaData swaggerMetaData = const SwaggerMetaData(
      description: 'Deletes a user from the system. Requires ADMIN role.',
      summary: 'Delete a user',
      operationId: '',
      consumes: [],
      produces: [],
      security: ["BearerAuth"],
      tags: ["Admin"],
      deprecated: false,
    ),
  }) {
    final Uri $url = Uri.parse('/api/admin/users/${id}');
    final Request $request = Request(
      'DELETE',
      $url,
      client.baseUrl,
      tag: swaggerMetaData,
    );
    return client.send<dynamic, dynamic>($request);
  }

  @override
  Future<Response<ApiAdminUsersGet$Response>> _apiAdminUsersGet({
    SwaggerMetaData swaggerMetaData = const SwaggerMetaData(
      description:
          'Returns a list of all users in the system. Requires ADMIN role.',
      summary: 'Get all users',
      operationId: '',
      consumes: [],
      produces: [],
      security: ["BearerAuth"],
      tags: ["Admin"],
      deprecated: false,
    ),
  }) {
    final Uri $url = Uri.parse('/api/admin/users');
    final Request $request = Request(
      'GET',
      $url,
      client.baseUrl,
      tag: swaggerMetaData,
    );
    return client.send<ApiAdminUsersGet$Response, ApiAdminUsersGet$Response>(
      $request,
    );
  }

  @override
  Future<Response<dynamic>> _apiAnalyticsSalesGet({
    SwaggerMetaData swaggerMetaData = const SwaggerMetaData(
      description:
          'Returns detailed sales analytics including summary, daily, monthly, and yearly data. Requires ADMIN role.',
      summary: 'Get sales analytics',
      operationId: '',
      consumes: [],
      produces: [],
      security: ["BearerAuth"],
      tags: ["Analytics"],
      deprecated: false,
    ),
  }) {
    final Uri $url = Uri.parse('/api/analytics/sales');
    final Request $request = Request(
      'GET',
      $url,
      client.baseUrl,
      tag: swaggerMetaData,
    );
    return client.send<dynamic, dynamic>($request);
  }

  @override
  Future<Response<ApiAuthLoginPost$Response>> _apiAuthLoginPost({
    required ApiAuthLoginPost$RequestBody? body,
    SwaggerMetaData swaggerMetaData = const SwaggerMetaData(
      description:
          'Email + password → JWT in `token` for any client. Use in Authorize (BearerAuth). Same users/passwords as NextAuth web login.',
      summary: 'Login (JWT)',
      operationId: '',
      consumes: [],
      produces: [],
      security: [],
      tags: ["Authentication"],
      deprecated: false,
    ),
  }) {
    final Uri $url = Uri.parse('/api/auth/login');
    final $body = body;
    final Request $request = Request(
      'POST',
      $url,
      client.baseUrl,
      body: $body,
      tag: swaggerMetaData,
    );
    return client.send<ApiAuthLoginPost$Response, ApiAuthLoginPost$Response>(
      $request,
    );
  }

  @override
  Future<Response<ApiAuthRegisterPost$Response>> _apiAuthRegisterPost({
    required ApiAuthRegisterPost$RequestBody? body,
    SwaggerMetaData swaggerMetaData = const SwaggerMetaData(
      description: 'Creates a new user with CUSTOMER role',
      summary: 'Register a new customer',
      operationId: '',
      consumes: [],
      produces: [],
      security: [],
      tags: ["Authentication"],
      deprecated: false,
    ),
  }) {
    final Uri $url = Uri.parse('/api/auth/register');
    final $body = body;
    final Request $request = Request(
      'POST',
      $url,
      client.baseUrl,
      body: $body,
      tag: swaggerMetaData,
    );
    return client
        .send<ApiAuthRegisterPost$Response, ApiAuthRegisterPost$Response>(
          $request,
        );
  }

  @override
  Future<Response<dynamic>> _apiCategoriesGet({
    SwaggerMetaData swaggerMetaData = const SwaggerMetaData(
      description: 'Returns a list of all product categories. Public endpoint.',
      summary: 'List all categories',
      operationId: '',
      consumes: [],
      produces: [],
      security: [],
      tags: ["Categories"],
      deprecated: false,
    ),
  }) {
    final Uri $url = Uri.parse('/api/categories');
    final Request $request = Request(
      'GET',
      $url,
      client.baseUrl,
      tag: swaggerMetaData,
    );
    return client.send<dynamic, dynamic>($request);
  }

  @override
  Future<Response<dynamic>> _apiOrdersIdGet({
    required String? id,
    SwaggerMetaData swaggerMetaData = const SwaggerMetaData(
      description:
          'Returns a specific order. Customers can only view their own.',
      summary: 'Fetch single order',
      operationId: '',
      consumes: [],
      produces: [],
      security: ["BearerAuth"],
      tags: ["Orders"],
      deprecated: false,
    ),
  }) {
    final Uri $url = Uri.parse('/api/orders/${id}');
    final Request $request = Request(
      'GET',
      $url,
      client.baseUrl,
      tag: swaggerMetaData,
    );
    return client.send<dynamic, dynamic>($request);
  }

  @override
  Future<Response<dynamic>> _apiOrdersIdPatch({
    required String? id,
    required ApiOrdersIdPatch$RequestBody? body,
    SwaggerMetaData swaggerMetaData = const SwaggerMetaData(
      description:
          'Updates the status of an existing order. Requires Admin/Staff role.',
      summary: 'Update order status',
      operationId: '',
      consumes: [],
      produces: [],
      security: ["BearerAuth"],
      tags: ["Orders"],
      deprecated: false,
    ),
  }) {
    final Uri $url = Uri.parse('/api/orders/${id}');
    final $body = body;
    final Request $request = Request(
      'PATCH',
      $url,
      client.baseUrl,
      body: $body,
      tag: swaggerMetaData,
    );
    return client.send<dynamic, dynamic>($request);
  }

  @override
  Future<Response<dynamic>> _apiOrdersPost({
    required ApiOrdersPost$RequestBody? body,
    SwaggerMetaData swaggerMetaData = const SwaggerMetaData(
      description: 'Places a new order. Requires CUSTOMER role.',
      summary: 'Create new order',
      operationId: '',
      consumes: [],
      produces: [],
      security: ["BearerAuth"],
      tags: ["Orders"],
      deprecated: false,
    ),
  }) {
    final Uri $url = Uri.parse('/api/orders');
    final $body = body;
    final Request $request = Request(
      'POST',
      $url,
      client.baseUrl,
      body: $body,
      tag: swaggerMetaData,
    );
    return client.send<dynamic, dynamic>($request);
  }

  @override
  Future<Response<dynamic>> _apiOrdersGet({
    SwaggerMetaData swaggerMetaData = const SwaggerMetaData(
      description:
          'Customers see their own orders. Admin and Staff see all orders.',
      summary: 'Get user\'s orders or all orders',
      operationId: '',
      consumes: [],
      produces: [],
      security: ["BearerAuth"],
      tags: ["Orders"],
      deprecated: false,
    ),
  }) {
    final Uri $url = Uri.parse('/api/orders');
    final Request $request = Request(
      'GET',
      $url,
      client.baseUrl,
      tag: swaggerMetaData,
    );
    return client.send<dynamic, dynamic>($request);
  }

  @override
  Future<Response<ApiProductsIdGet$Response>> _apiProductsIdGet({
    required String? id,
    SwaggerMetaData swaggerMetaData = const SwaggerMetaData(
      description: 'Returns a detailed product by ID. Public endpoint.',
      summary: 'Get single product',
      operationId: '',
      consumes: [],
      produces: [],
      security: [],
      tags: ["Products"],
      deprecated: false,
    ),
  }) {
    final Uri $url = Uri.parse('/api/products/${id}');
    final Request $request = Request(
      'GET',
      $url,
      client.baseUrl,
      tag: swaggerMetaData,
    );
    return client.send<ApiProductsIdGet$Response, ApiProductsIdGet$Response>(
      $request,
    );
  }

  @override
  Future<Response<ApiProductsGet$Response>> _apiProductsGet({
    SwaggerMetaData swaggerMetaData = const SwaggerMetaData(
      description:
          'Returns a list of all active products, along with their category. Public endpoint.',
      summary: 'List all active products',
      operationId: '',
      consumes: [],
      produces: [],
      security: [],
      tags: ["Products"],
      deprecated: false,
    ),
  }) {
    final Uri $url = Uri.parse('/api/products');
    final Request $request = Request(
      'GET',
      $url,
      client.baseUrl,
      tag: swaggerMetaData,
    );
    return client.send<ApiProductsGet$Response, ApiProductsGet$Response>(
      $request,
    );
  }
}
