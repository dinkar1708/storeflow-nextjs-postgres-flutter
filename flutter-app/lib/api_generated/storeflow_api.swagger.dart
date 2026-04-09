// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element_parameter

import 'package:json_annotation/json_annotation.dart';
import 'package:json_annotation/json_annotation.dart' as json;
import 'package:collection/collection.dart';
import 'dart:convert';

import 'package:chopper/chopper.dart';

import 'client_mapping.dart';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'package:http/http.dart' show MultipartFile;
import 'package:chopper/chopper.dart' as chopper;
import 'storeflow_api.enums.swagger.dart' as enums;
import 'storeflow_api.metadata.swagger.dart';
export 'storeflow_api.enums.swagger.dart';

part 'storeflow_api.swagger.chopper.dart';
part 'storeflow_api.swagger.g.dart';

// **************************************************************************
// SwaggerChopperGenerator
// **************************************************************************

@ChopperApi()
abstract class StoreflowApi extends ChopperService {
  static StoreflowApi create({
    ChopperClient? client,
    http.Client? httpClient,
    Authenticator? authenticator,
    ErrorConverter? errorConverter,
    Converter? converter,
    Uri? baseUrl,
    List<Interceptor>? interceptors,
  }) {
    if (client != null) {
      return _$StoreflowApi(client);
    }

    final newClient = ChopperClient(
      services: [_$StoreflowApi()],
      converter: converter ?? $JsonSerializableConverter(),
      interceptors: interceptors ?? [],
      client: httpClient,
      authenticator: authenticator,
      errorConverter: errorConverter,
      baseUrl: baseUrl ?? Uri.parse('http://'),
    );
    return _$StoreflowApi(newClient);
  }

  ///List all products (Admin)
  Future<chopper.Response> apiAdminProductsGet() {
    return _apiAdminProductsGet();
  }

  ///List all products (Admin)
  @GET(path: '/api/admin/products')
  Future<chopper.Response> _apiAdminProductsGet({
    @chopper.Tag()
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
  });

  ///Create new product
  Future<chopper.Response> apiAdminProductsPost({
    required ApiAdminProductsPost$RequestBody? body,
  }) {
    return _apiAdminProductsPost(body: body);
  }

  ///Create new product
  @POST(path: '/api/admin/products', optionalBody: true)
  Future<chopper.Response> _apiAdminProductsPost({
    @Body() required ApiAdminProductsPost$RequestBody? body,
    @chopper.Tag()
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
  });

  ///Update user role or status
  ///@param id
  Future<chopper.Response> apiAdminUsersIdPatch({
    required String? id,
    required ApiAdminUsersIdPatch$RequestBody? body,
  }) {
    return _apiAdminUsersIdPatch(id: id, body: body);
  }

  ///Update user role or status
  ///@param id
  @PATCH(path: '/api/admin/users/{id}', optionalBody: true)
  Future<chopper.Response> _apiAdminUsersIdPatch({
    @Path('id') required String? id,
    @Body() required ApiAdminUsersIdPatch$RequestBody? body,
    @chopper.Tag()
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
  });

  ///Delete a user
  ///@param id
  Future<chopper.Response> apiAdminUsersIdDelete({required String? id}) {
    return _apiAdminUsersIdDelete(id: id);
  }

  ///Delete a user
  ///@param id
  @DELETE(path: '/api/admin/users/{id}')
  Future<chopper.Response> _apiAdminUsersIdDelete({
    @Path('id') required String? id,
    @chopper.Tag()
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
  });

  ///Get all users
  Future<chopper.Response<ApiAdminUsersGet$Response>> apiAdminUsersGet() {
    generatedMapping.putIfAbsent(
      ApiAdminUsersGet$Response,
      () => ApiAdminUsersGet$Response.fromJsonFactory,
    );

    return _apiAdminUsersGet();
  }

  ///Get all users
  @GET(path: '/api/admin/users')
  Future<chopper.Response<ApiAdminUsersGet$Response>> _apiAdminUsersGet({
    @chopper.Tag()
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
  });

  ///Get sales analytics
  Future<chopper.Response> apiAnalyticsSalesGet() {
    return _apiAnalyticsSalesGet();
  }

  ///Get sales analytics
  @GET(path: '/api/analytics/sales')
  Future<chopper.Response> _apiAnalyticsSalesGet({
    @chopper.Tag()
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
  });

  ///Login (JWT)
  Future<chopper.Response<ApiAuthLoginPost$Response>> apiAuthLoginPost({
    required ApiAuthLoginPost$RequestBody? body,
  }) {
    generatedMapping.putIfAbsent(
      ApiAuthLoginPost$Response,
      () => ApiAuthLoginPost$Response.fromJsonFactory,
    );

    return _apiAuthLoginPost(body: body);
  }

  ///Login (JWT)
  @POST(path: '/api/auth/login', optionalBody: true)
  Future<chopper.Response<ApiAuthLoginPost$Response>> _apiAuthLoginPost({
    @Body() required ApiAuthLoginPost$RequestBody? body,
    @chopper.Tag()
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
  });

  ///Register a new customer
  Future<chopper.Response<ApiAuthRegisterPost$Response>> apiAuthRegisterPost({
    required ApiAuthRegisterPost$RequestBody? body,
  }) {
    generatedMapping.putIfAbsent(
      ApiAuthRegisterPost$Response,
      () => ApiAuthRegisterPost$Response.fromJsonFactory,
    );

    return _apiAuthRegisterPost(body: body);
  }

  ///Register a new customer
  @POST(path: '/api/auth/register', optionalBody: true)
  Future<chopper.Response<ApiAuthRegisterPost$Response>> _apiAuthRegisterPost({
    @Body() required ApiAuthRegisterPost$RequestBody? body,
    @chopper.Tag()
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
  });

  ///List all categories
  Future<chopper.Response> apiCategoriesGet() {
    return _apiCategoriesGet();
  }

  ///List all categories
  @GET(path: '/api/categories')
  Future<chopper.Response> _apiCategoriesGet({
    @chopper.Tag()
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
  });

  ///Fetch single order
  ///@param id
  Future<chopper.Response> apiOrdersIdGet({required String? id}) {
    return _apiOrdersIdGet(id: id);
  }

  ///Fetch single order
  ///@param id
  @GET(path: '/api/orders/{id}')
  Future<chopper.Response> _apiOrdersIdGet({
    @Path('id') required String? id,
    @chopper.Tag()
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
  });

  ///Update order status
  ///@param id
  Future<chopper.Response> apiOrdersIdPatch({
    required String? id,
    required ApiOrdersIdPatch$RequestBody? body,
  }) {
    return _apiOrdersIdPatch(id: id, body: body);
  }

  ///Update order status
  ///@param id
  @PATCH(path: '/api/orders/{id}', optionalBody: true)
  Future<chopper.Response> _apiOrdersIdPatch({
    @Path('id') required String? id,
    @Body() required ApiOrdersIdPatch$RequestBody? body,
    @chopper.Tag()
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
  });

  ///Create new order
  Future<chopper.Response> apiOrdersPost({
    required ApiOrdersPost$RequestBody? body,
  }) {
    return _apiOrdersPost(body: body);
  }

  ///Create new order
  @POST(path: '/api/orders', optionalBody: true)
  Future<chopper.Response> _apiOrdersPost({
    @Body() required ApiOrdersPost$RequestBody? body,
    @chopper.Tag()
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
  });

  ///Get user's orders or all orders
  Future<chopper.Response> apiOrdersGet() {
    return _apiOrdersGet();
  }

  ///Get user's orders or all orders
  @GET(path: '/api/orders')
  Future<chopper.Response> _apiOrdersGet({
    @chopper.Tag()
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
  });

  ///Get single product
  ///@param id
  Future<chopper.Response<ApiProductsIdGet$Response>> apiProductsIdGet({
    required String? id,
  }) {
    generatedMapping.putIfAbsent(
      ApiProductsIdGet$Response,
      () => ApiProductsIdGet$Response.fromJsonFactory,
    );

    return _apiProductsIdGet(id: id);
  }

  ///Get single product
  ///@param id
  @GET(path: '/api/products/{id}')
  Future<chopper.Response<ApiProductsIdGet$Response>> _apiProductsIdGet({
    @Path('id') required String? id,
    @chopper.Tag()
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
  });

  ///List all active products
  Future<chopper.Response<ApiProductsGet$Response>> apiProductsGet() {
    generatedMapping.putIfAbsent(
      ApiProductsGet$Response,
      () => ApiProductsGet$Response.fromJsonFactory,
    );

    return _apiProductsGet();
  }

  ///List all active products
  @GET(path: '/api/products')
  Future<chopper.Response<ApiProductsGet$Response>> _apiProductsGet({
    @chopper.Tag()
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
  });
}

@JsonSerializable(explicitToJson: true)
class ApiAdminProductsPost$RequestBody {
  const ApiAdminProductsPost$RequestBody({
    required this.name,
    this.description,
    required this.price,
    this.costPrice,
    this.stock,
    required this.categoryId,
    this.sku,
  });

  factory ApiAdminProductsPost$RequestBody.fromJson(
    Map<String, dynamic> json,
  ) => _$ApiAdminProductsPost$RequestBodyFromJson(json);

  static const toJsonFactory = _$ApiAdminProductsPost$RequestBodyToJson;
  Map<String, dynamic> toJson() =>
      _$ApiAdminProductsPost$RequestBodyToJson(this);

  @JsonKey(name: 'name')
  final String name;
  @JsonKey(name: 'description')
  final String? description;
  @JsonKey(name: 'price')
  final double price;
  @JsonKey(name: 'costPrice')
  final double? costPrice;
  @JsonKey(name: 'stock')
  final int? stock;
  @JsonKey(name: 'categoryId')
  final String categoryId;
  @JsonKey(name: 'sku')
  final String? sku;
  static const fromJsonFactory = _$ApiAdminProductsPost$RequestBodyFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiAdminProductsPost$RequestBody &&
            (identical(other.name, name) ||
                const DeepCollectionEquality().equals(other.name, name)) &&
            (identical(other.description, description) ||
                const DeepCollectionEquality().equals(
                  other.description,
                  description,
                )) &&
            (identical(other.price, price) ||
                const DeepCollectionEquality().equals(other.price, price)) &&
            (identical(other.costPrice, costPrice) ||
                const DeepCollectionEquality().equals(
                  other.costPrice,
                  costPrice,
                )) &&
            (identical(other.stock, stock) ||
                const DeepCollectionEquality().equals(other.stock, stock)) &&
            (identical(other.categoryId, categoryId) ||
                const DeepCollectionEquality().equals(
                  other.categoryId,
                  categoryId,
                )) &&
            (identical(other.sku, sku) ||
                const DeepCollectionEquality().equals(other.sku, sku)));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(name) ^
      const DeepCollectionEquality().hash(description) ^
      const DeepCollectionEquality().hash(price) ^
      const DeepCollectionEquality().hash(costPrice) ^
      const DeepCollectionEquality().hash(stock) ^
      const DeepCollectionEquality().hash(categoryId) ^
      const DeepCollectionEquality().hash(sku) ^
      runtimeType.hashCode;
}

extension $ApiAdminProductsPost$RequestBodyExtension
    on ApiAdminProductsPost$RequestBody {
  ApiAdminProductsPost$RequestBody copyWith({
    String? name,
    String? description,
    double? price,
    double? costPrice,
    int? stock,
    String? categoryId,
    String? sku,
  }) {
    return ApiAdminProductsPost$RequestBody(
      name: name ?? this.name,
      description: description ?? this.description,
      price: price ?? this.price,
      costPrice: costPrice ?? this.costPrice,
      stock: stock ?? this.stock,
      categoryId: categoryId ?? this.categoryId,
      sku: sku ?? this.sku,
    );
  }

  ApiAdminProductsPost$RequestBody copyWithWrapped({
    Wrapped<String>? name,
    Wrapped<String?>? description,
    Wrapped<double>? price,
    Wrapped<double?>? costPrice,
    Wrapped<int?>? stock,
    Wrapped<String>? categoryId,
    Wrapped<String?>? sku,
  }) {
    return ApiAdminProductsPost$RequestBody(
      name: (name != null ? name.value : this.name),
      description: (description != null ? description.value : this.description),
      price: (price != null ? price.value : this.price),
      costPrice: (costPrice != null ? costPrice.value : this.costPrice),
      stock: (stock != null ? stock.value : this.stock),
      categoryId: (categoryId != null ? categoryId.value : this.categoryId),
      sku: (sku != null ? sku.value : this.sku),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiAdminUsersIdPatch$RequestBody {
  const ApiAdminUsersIdPatch$RequestBody({this.role, this.isActive});

  factory ApiAdminUsersIdPatch$RequestBody.fromJson(
    Map<String, dynamic> json,
  ) => _$ApiAdminUsersIdPatch$RequestBodyFromJson(json);

  static const toJsonFactory = _$ApiAdminUsersIdPatch$RequestBodyToJson;
  Map<String, dynamic> toJson() =>
      _$ApiAdminUsersIdPatch$RequestBodyToJson(this);

  @JsonKey(
    name: 'role',
    toJson: apiAdminUsersIdPatch$RequestBodyRoleNullableToJson,
    fromJson: apiAdminUsersIdPatch$RequestBodyRoleNullableFromJson,
  )
  final enums.ApiAdminUsersIdPatch$RequestBodyRole? role;
  @JsonKey(name: 'isActive')
  final bool? isActive;
  static const fromJsonFactory = _$ApiAdminUsersIdPatch$RequestBodyFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiAdminUsersIdPatch$RequestBody &&
            (identical(other.role, role) ||
                const DeepCollectionEquality().equals(other.role, role)) &&
            (identical(other.isActive, isActive) ||
                const DeepCollectionEquality().equals(
                  other.isActive,
                  isActive,
                )));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(role) ^
      const DeepCollectionEquality().hash(isActive) ^
      runtimeType.hashCode;
}

extension $ApiAdminUsersIdPatch$RequestBodyExtension
    on ApiAdminUsersIdPatch$RequestBody {
  ApiAdminUsersIdPatch$RequestBody copyWith({
    enums.ApiAdminUsersIdPatch$RequestBodyRole? role,
    bool? isActive,
  }) {
    return ApiAdminUsersIdPatch$RequestBody(
      role: role ?? this.role,
      isActive: isActive ?? this.isActive,
    );
  }

  ApiAdminUsersIdPatch$RequestBody copyWithWrapped({
    Wrapped<enums.ApiAdminUsersIdPatch$RequestBodyRole?>? role,
    Wrapped<bool?>? isActive,
  }) {
    return ApiAdminUsersIdPatch$RequestBody(
      role: (role != null ? role.value : this.role),
      isActive: (isActive != null ? isActive.value : this.isActive),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiAuthLoginPost$RequestBody {
  const ApiAuthLoginPost$RequestBody({
    required this.email,
    required this.password,
  });

  factory ApiAuthLoginPost$RequestBody.fromJson(Map<String, dynamic> json) =>
      _$ApiAuthLoginPost$RequestBodyFromJson(json);

  static const toJsonFactory = _$ApiAuthLoginPost$RequestBodyToJson;
  Map<String, dynamic> toJson() => _$ApiAuthLoginPost$RequestBodyToJson(this);

  @JsonKey(name: 'email')
  final String email;
  @JsonKey(name: 'password')
  final String password;
  static const fromJsonFactory = _$ApiAuthLoginPost$RequestBodyFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiAuthLoginPost$RequestBody &&
            (identical(other.email, email) ||
                const DeepCollectionEquality().equals(other.email, email)) &&
            (identical(other.password, password) ||
                const DeepCollectionEquality().equals(
                  other.password,
                  password,
                )));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(email) ^
      const DeepCollectionEquality().hash(password) ^
      runtimeType.hashCode;
}

extension $ApiAuthLoginPost$RequestBodyExtension
    on ApiAuthLoginPost$RequestBody {
  ApiAuthLoginPost$RequestBody copyWith({String? email, String? password}) {
    return ApiAuthLoginPost$RequestBody(
      email: email ?? this.email,
      password: password ?? this.password,
    );
  }

  ApiAuthLoginPost$RequestBody copyWithWrapped({
    Wrapped<String>? email,
    Wrapped<String>? password,
  }) {
    return ApiAuthLoginPost$RequestBody(
      email: (email != null ? email.value : this.email),
      password: (password != null ? password.value : this.password),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiAuthRegisterPost$RequestBody {
  const ApiAuthRegisterPost$RequestBody({
    required this.email,
    required this.password,
    required this.name,
  });

  factory ApiAuthRegisterPost$RequestBody.fromJson(Map<String, dynamic> json) =>
      _$ApiAuthRegisterPost$RequestBodyFromJson(json);

  static const toJsonFactory = _$ApiAuthRegisterPost$RequestBodyToJson;
  Map<String, dynamic> toJson() =>
      _$ApiAuthRegisterPost$RequestBodyToJson(this);

  @JsonKey(name: 'email')
  final String email;
  @JsonKey(name: 'password')
  final String password;
  @JsonKey(name: 'name')
  final String name;
  static const fromJsonFactory = _$ApiAuthRegisterPost$RequestBodyFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiAuthRegisterPost$RequestBody &&
            (identical(other.email, email) ||
                const DeepCollectionEquality().equals(other.email, email)) &&
            (identical(other.password, password) ||
                const DeepCollectionEquality().equals(
                  other.password,
                  password,
                )) &&
            (identical(other.name, name) ||
                const DeepCollectionEquality().equals(other.name, name)));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(email) ^
      const DeepCollectionEquality().hash(password) ^
      const DeepCollectionEquality().hash(name) ^
      runtimeType.hashCode;
}

extension $ApiAuthRegisterPost$RequestBodyExtension
    on ApiAuthRegisterPost$RequestBody {
  ApiAuthRegisterPost$RequestBody copyWith({
    String? email,
    String? password,
    String? name,
  }) {
    return ApiAuthRegisterPost$RequestBody(
      email: email ?? this.email,
      password: password ?? this.password,
      name: name ?? this.name,
    );
  }

  ApiAuthRegisterPost$RequestBody copyWithWrapped({
    Wrapped<String>? email,
    Wrapped<String>? password,
    Wrapped<String>? name,
  }) {
    return ApiAuthRegisterPost$RequestBody(
      email: (email != null ? email.value : this.email),
      password: (password != null ? password.value : this.password),
      name: (name != null ? name.value : this.name),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiOrdersIdPatch$RequestBody {
  const ApiOrdersIdPatch$RequestBody({required this.status});

  factory ApiOrdersIdPatch$RequestBody.fromJson(Map<String, dynamic> json) =>
      _$ApiOrdersIdPatch$RequestBodyFromJson(json);

  static const toJsonFactory = _$ApiOrdersIdPatch$RequestBodyToJson;
  Map<String, dynamic> toJson() => _$ApiOrdersIdPatch$RequestBodyToJson(this);

  @JsonKey(name: 'status')
  final String status;
  static const fromJsonFactory = _$ApiOrdersIdPatch$RequestBodyFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiOrdersIdPatch$RequestBody &&
            (identical(other.status, status) ||
                const DeepCollectionEquality().equals(other.status, status)));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(status) ^ runtimeType.hashCode;
}

extension $ApiOrdersIdPatch$RequestBodyExtension
    on ApiOrdersIdPatch$RequestBody {
  ApiOrdersIdPatch$RequestBody copyWith({String? status}) {
    return ApiOrdersIdPatch$RequestBody(status: status ?? this.status);
  }

  ApiOrdersIdPatch$RequestBody copyWithWrapped({Wrapped<String>? status}) {
    return ApiOrdersIdPatch$RequestBody(
      status: (status != null ? status.value : this.status),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiOrdersPost$RequestBody {
  const ApiOrdersPost$RequestBody({required this.items, required this.total});

  factory ApiOrdersPost$RequestBody.fromJson(Map<String, dynamic> json) =>
      _$ApiOrdersPost$RequestBodyFromJson(json);

  static const toJsonFactory = _$ApiOrdersPost$RequestBodyToJson;
  Map<String, dynamic> toJson() => _$ApiOrdersPost$RequestBodyToJson(this);

  @JsonKey(name: 'items')
  final List<ApiOrdersPost$RequestBody$Items$Item> items;
  @JsonKey(name: 'total')
  final double total;
  static const fromJsonFactory = _$ApiOrdersPost$RequestBodyFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiOrdersPost$RequestBody &&
            (identical(other.items, items) ||
                const DeepCollectionEquality().equals(other.items, items)) &&
            (identical(other.total, total) ||
                const DeepCollectionEquality().equals(other.total, total)));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(items) ^
      const DeepCollectionEquality().hash(total) ^
      runtimeType.hashCode;
}

extension $ApiOrdersPost$RequestBodyExtension on ApiOrdersPost$RequestBody {
  ApiOrdersPost$RequestBody copyWith({
    List<ApiOrdersPost$RequestBody$Items$Item>? items,
    double? total,
  }) {
    return ApiOrdersPost$RequestBody(
      items: items ?? this.items,
      total: total ?? this.total,
    );
  }

  ApiOrdersPost$RequestBody copyWithWrapped({
    Wrapped<List<ApiOrdersPost$RequestBody$Items$Item>>? items,
    Wrapped<double>? total,
  }) {
    return ApiOrdersPost$RequestBody(
      items: (items != null ? items.value : this.items),
      total: (total != null ? total.value : this.total),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiAdminUsersGet$Response {
  const ApiAdminUsersGet$Response({this.users});

  factory ApiAdminUsersGet$Response.fromJson(Map<String, dynamic> json) =>
      _$ApiAdminUsersGet$ResponseFromJson(json);

  static const toJsonFactory = _$ApiAdminUsersGet$ResponseToJson;
  Map<String, dynamic> toJson() => _$ApiAdminUsersGet$ResponseToJson(this);

  @JsonKey(name: 'users')
  final List<ApiAdminUsersGet$Response$Users$Item>? users;
  static const fromJsonFactory = _$ApiAdminUsersGet$ResponseFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiAdminUsersGet$Response &&
            (identical(other.users, users) ||
                const DeepCollectionEquality().equals(other.users, users)));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(users) ^ runtimeType.hashCode;
}

extension $ApiAdminUsersGet$ResponseExtension on ApiAdminUsersGet$Response {
  ApiAdminUsersGet$Response copyWith({
    List<ApiAdminUsersGet$Response$Users$Item>? users,
  }) {
    return ApiAdminUsersGet$Response(users: users ?? this.users);
  }

  ApiAdminUsersGet$Response copyWithWrapped({
    Wrapped<List<ApiAdminUsersGet$Response$Users$Item>?>? users,
  }) {
    return ApiAdminUsersGet$Response(
      users: (users != null ? users.value : this.users),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiAuthLoginPost$Response {
  const ApiAuthLoginPost$Response({this.token, this.user});

  factory ApiAuthLoginPost$Response.fromJson(Map<String, dynamic> json) =>
      _$ApiAuthLoginPost$ResponseFromJson(json);

  static const toJsonFactory = _$ApiAuthLoginPost$ResponseToJson;
  Map<String, dynamic> toJson() => _$ApiAuthLoginPost$ResponseToJson(this);

  @JsonKey(name: 'token')
  final String? token;
  @JsonKey(name: 'user')
  final ApiAuthLoginPost$Response$User? user;
  static const fromJsonFactory = _$ApiAuthLoginPost$ResponseFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiAuthLoginPost$Response &&
            (identical(other.token, token) ||
                const DeepCollectionEquality().equals(other.token, token)) &&
            (identical(other.user, user) ||
                const DeepCollectionEquality().equals(other.user, user)));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(token) ^
      const DeepCollectionEquality().hash(user) ^
      runtimeType.hashCode;
}

extension $ApiAuthLoginPost$ResponseExtension on ApiAuthLoginPost$Response {
  ApiAuthLoginPost$Response copyWith({
    String? token,
    ApiAuthLoginPost$Response$User? user,
  }) {
    return ApiAuthLoginPost$Response(
      token: token ?? this.token,
      user: user ?? this.user,
    );
  }

  ApiAuthLoginPost$Response copyWithWrapped({
    Wrapped<String?>? token,
    Wrapped<ApiAuthLoginPost$Response$User?>? user,
  }) {
    return ApiAuthLoginPost$Response(
      token: (token != null ? token.value : this.token),
      user: (user != null ? user.value : this.user),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiAuthRegisterPost$Response {
  const ApiAuthRegisterPost$Response({this.message, this.user});

  factory ApiAuthRegisterPost$Response.fromJson(Map<String, dynamic> json) =>
      _$ApiAuthRegisterPost$ResponseFromJson(json);

  static const toJsonFactory = _$ApiAuthRegisterPost$ResponseToJson;
  Map<String, dynamic> toJson() => _$ApiAuthRegisterPost$ResponseToJson(this);

  @JsonKey(name: 'message')
  final String? message;
  @JsonKey(name: 'user')
  final ApiAuthRegisterPost$Response$User? user;
  static const fromJsonFactory = _$ApiAuthRegisterPost$ResponseFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiAuthRegisterPost$Response &&
            (identical(other.message, message) ||
                const DeepCollectionEquality().equals(
                  other.message,
                  message,
                )) &&
            (identical(other.user, user) ||
                const DeepCollectionEquality().equals(other.user, user)));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(message) ^
      const DeepCollectionEquality().hash(user) ^
      runtimeType.hashCode;
}

extension $ApiAuthRegisterPost$ResponseExtension
    on ApiAuthRegisterPost$Response {
  ApiAuthRegisterPost$Response copyWith({
    String? message,
    ApiAuthRegisterPost$Response$User? user,
  }) {
    return ApiAuthRegisterPost$Response(
      message: message ?? this.message,
      user: user ?? this.user,
    );
  }

  ApiAuthRegisterPost$Response copyWithWrapped({
    Wrapped<String?>? message,
    Wrapped<ApiAuthRegisterPost$Response$User?>? user,
  }) {
    return ApiAuthRegisterPost$Response(
      message: (message != null ? message.value : this.message),
      user: (user != null ? user.value : this.user),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiProductsIdGet$Response {
  const ApiProductsIdGet$Response({this.product});

  factory ApiProductsIdGet$Response.fromJson(Map<String, dynamic> json) =>
      _$ApiProductsIdGet$ResponseFromJson(json);

  static const toJsonFactory = _$ApiProductsIdGet$ResponseToJson;
  Map<String, dynamic> toJson() => _$ApiProductsIdGet$ResponseToJson(this);

  @JsonKey(name: 'product')
  final ApiProductsIdGet$Response$Product? product;
  static const fromJsonFactory = _$ApiProductsIdGet$ResponseFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiProductsIdGet$Response &&
            (identical(other.product, product) ||
                const DeepCollectionEquality().equals(other.product, product)));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(product) ^ runtimeType.hashCode;
}

extension $ApiProductsIdGet$ResponseExtension on ApiProductsIdGet$Response {
  ApiProductsIdGet$Response copyWith({
    ApiProductsIdGet$Response$Product? product,
  }) {
    return ApiProductsIdGet$Response(product: product ?? this.product);
  }

  ApiProductsIdGet$Response copyWithWrapped({
    Wrapped<ApiProductsIdGet$Response$Product?>? product,
  }) {
    return ApiProductsIdGet$Response(
      product: (product != null ? product.value : this.product),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiProductsGet$Response {
  const ApiProductsGet$Response({this.products});

  factory ApiProductsGet$Response.fromJson(Map<String, dynamic> json) =>
      _$ApiProductsGet$ResponseFromJson(json);

  static const toJsonFactory = _$ApiProductsGet$ResponseToJson;
  Map<String, dynamic> toJson() => _$ApiProductsGet$ResponseToJson(this);

  @JsonKey(name: 'products')
  final List<ApiProductsGet$Response$Products$Item>? products;
  static const fromJsonFactory = _$ApiProductsGet$ResponseFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiProductsGet$Response &&
            (identical(other.products, products) ||
                const DeepCollectionEquality().equals(
                  other.products,
                  products,
                )));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(products) ^ runtimeType.hashCode;
}

extension $ApiProductsGet$ResponseExtension on ApiProductsGet$Response {
  ApiProductsGet$Response copyWith({
    List<ApiProductsGet$Response$Products$Item>? products,
  }) {
    return ApiProductsGet$Response(products: products ?? this.products);
  }

  ApiProductsGet$Response copyWithWrapped({
    Wrapped<List<ApiProductsGet$Response$Products$Item>?>? products,
  }) {
    return ApiProductsGet$Response(
      products: (products != null ? products.value : this.products),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiOrdersPost$RequestBody$Items$Item {
  const ApiOrdersPost$RequestBody$Items$Item({
    this.productId,
    this.quantity,
    this.price,
  });

  factory ApiOrdersPost$RequestBody$Items$Item.fromJson(
    Map<String, dynamic> json,
  ) => _$ApiOrdersPost$RequestBody$Items$ItemFromJson(json);

  static const toJsonFactory = _$ApiOrdersPost$RequestBody$Items$ItemToJson;
  Map<String, dynamic> toJson() =>
      _$ApiOrdersPost$RequestBody$Items$ItemToJson(this);

  @JsonKey(name: 'productId')
  final String? productId;
  @JsonKey(name: 'quantity')
  final int? quantity;
  @JsonKey(name: 'price')
  final double? price;
  static const fromJsonFactory = _$ApiOrdersPost$RequestBody$Items$ItemFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiOrdersPost$RequestBody$Items$Item &&
            (identical(other.productId, productId) ||
                const DeepCollectionEquality().equals(
                  other.productId,
                  productId,
                )) &&
            (identical(other.quantity, quantity) ||
                const DeepCollectionEquality().equals(
                  other.quantity,
                  quantity,
                )) &&
            (identical(other.price, price) ||
                const DeepCollectionEquality().equals(other.price, price)));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(productId) ^
      const DeepCollectionEquality().hash(quantity) ^
      const DeepCollectionEquality().hash(price) ^
      runtimeType.hashCode;
}

extension $ApiOrdersPost$RequestBody$Items$ItemExtension
    on ApiOrdersPost$RequestBody$Items$Item {
  ApiOrdersPost$RequestBody$Items$Item copyWith({
    String? productId,
    int? quantity,
    double? price,
  }) {
    return ApiOrdersPost$RequestBody$Items$Item(
      productId: productId ?? this.productId,
      quantity: quantity ?? this.quantity,
      price: price ?? this.price,
    );
  }

  ApiOrdersPost$RequestBody$Items$Item copyWithWrapped({
    Wrapped<String?>? productId,
    Wrapped<int?>? quantity,
    Wrapped<double?>? price,
  }) {
    return ApiOrdersPost$RequestBody$Items$Item(
      productId: (productId != null ? productId.value : this.productId),
      quantity: (quantity != null ? quantity.value : this.quantity),
      price: (price != null ? price.value : this.price),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiAdminUsersGet$Response$Users$Item {
  const ApiAdminUsersGet$Response$Users$Item({
    this.id,
    this.email,
    this.name,
    this.role,
    this.isActive,
    this.createdAt,
    this.updatedAt,
  });

  factory ApiAdminUsersGet$Response$Users$Item.fromJson(
    Map<String, dynamic> json,
  ) => _$ApiAdminUsersGet$Response$Users$ItemFromJson(json);

  static const toJsonFactory = _$ApiAdminUsersGet$Response$Users$ItemToJson;
  Map<String, dynamic> toJson() =>
      _$ApiAdminUsersGet$Response$Users$ItemToJson(this);

  @JsonKey(name: 'id')
  final String? id;
  @JsonKey(name: 'email')
  final String? email;
  @JsonKey(name: 'name')
  final String? name;
  @JsonKey(name: 'role')
  final String? role;
  @JsonKey(name: 'isActive')
  final bool? isActive;
  @JsonKey(name: 'createdAt')
  final DateTime? createdAt;
  @JsonKey(name: 'updatedAt')
  final DateTime? updatedAt;
  static const fromJsonFactory = _$ApiAdminUsersGet$Response$Users$ItemFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiAdminUsersGet$Response$Users$Item &&
            (identical(other.id, id) ||
                const DeepCollectionEquality().equals(other.id, id)) &&
            (identical(other.email, email) ||
                const DeepCollectionEquality().equals(other.email, email)) &&
            (identical(other.name, name) ||
                const DeepCollectionEquality().equals(other.name, name)) &&
            (identical(other.role, role) ||
                const DeepCollectionEquality().equals(other.role, role)) &&
            (identical(other.isActive, isActive) ||
                const DeepCollectionEquality().equals(
                  other.isActive,
                  isActive,
                )) &&
            (identical(other.createdAt, createdAt) ||
                const DeepCollectionEquality().equals(
                  other.createdAt,
                  createdAt,
                )) &&
            (identical(other.updatedAt, updatedAt) ||
                const DeepCollectionEquality().equals(
                  other.updatedAt,
                  updatedAt,
                )));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(id) ^
      const DeepCollectionEquality().hash(email) ^
      const DeepCollectionEquality().hash(name) ^
      const DeepCollectionEquality().hash(role) ^
      const DeepCollectionEquality().hash(isActive) ^
      const DeepCollectionEquality().hash(createdAt) ^
      const DeepCollectionEquality().hash(updatedAt) ^
      runtimeType.hashCode;
}

extension $ApiAdminUsersGet$Response$Users$ItemExtension
    on ApiAdminUsersGet$Response$Users$Item {
  ApiAdminUsersGet$Response$Users$Item copyWith({
    String? id,
    String? email,
    String? name,
    String? role,
    bool? isActive,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ApiAdminUsersGet$Response$Users$Item(
      id: id ?? this.id,
      email: email ?? this.email,
      name: name ?? this.name,
      role: role ?? this.role,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  ApiAdminUsersGet$Response$Users$Item copyWithWrapped({
    Wrapped<String?>? id,
    Wrapped<String?>? email,
    Wrapped<String?>? name,
    Wrapped<String?>? role,
    Wrapped<bool?>? isActive,
    Wrapped<DateTime?>? createdAt,
    Wrapped<DateTime?>? updatedAt,
  }) {
    return ApiAdminUsersGet$Response$Users$Item(
      id: (id != null ? id.value : this.id),
      email: (email != null ? email.value : this.email),
      name: (name != null ? name.value : this.name),
      role: (role != null ? role.value : this.role),
      isActive: (isActive != null ? isActive.value : this.isActive),
      createdAt: (createdAt != null ? createdAt.value : this.createdAt),
      updatedAt: (updatedAt != null ? updatedAt.value : this.updatedAt),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiAuthLoginPost$Response$User {
  const ApiAuthLoginPost$Response$User({
    this.id,
    this.email,
    this.name,
    this.role,
  });

  factory ApiAuthLoginPost$Response$User.fromJson(Map<String, dynamic> json) =>
      _$ApiAuthLoginPost$Response$UserFromJson(json);

  static const toJsonFactory = _$ApiAuthLoginPost$Response$UserToJson;
  Map<String, dynamic> toJson() => _$ApiAuthLoginPost$Response$UserToJson(this);

  @JsonKey(name: 'id')
  final String? id;
  @JsonKey(name: 'email')
  final String? email;
  @JsonKey(name: 'name')
  final String? name;
  @JsonKey(name: 'role')
  final String? role;
  static const fromJsonFactory = _$ApiAuthLoginPost$Response$UserFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiAuthLoginPost$Response$User &&
            (identical(other.id, id) ||
                const DeepCollectionEquality().equals(other.id, id)) &&
            (identical(other.email, email) ||
                const DeepCollectionEquality().equals(other.email, email)) &&
            (identical(other.name, name) ||
                const DeepCollectionEquality().equals(other.name, name)) &&
            (identical(other.role, role) ||
                const DeepCollectionEquality().equals(other.role, role)));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(id) ^
      const DeepCollectionEquality().hash(email) ^
      const DeepCollectionEquality().hash(name) ^
      const DeepCollectionEquality().hash(role) ^
      runtimeType.hashCode;
}

extension $ApiAuthLoginPost$Response$UserExtension
    on ApiAuthLoginPost$Response$User {
  ApiAuthLoginPost$Response$User copyWith({
    String? id,
    String? email,
    String? name,
    String? role,
  }) {
    return ApiAuthLoginPost$Response$User(
      id: id ?? this.id,
      email: email ?? this.email,
      name: name ?? this.name,
      role: role ?? this.role,
    );
  }

  ApiAuthLoginPost$Response$User copyWithWrapped({
    Wrapped<String?>? id,
    Wrapped<String?>? email,
    Wrapped<String?>? name,
    Wrapped<String?>? role,
  }) {
    return ApiAuthLoginPost$Response$User(
      id: (id != null ? id.value : this.id),
      email: (email != null ? email.value : this.email),
      name: (name != null ? name.value : this.name),
      role: (role != null ? role.value : this.role),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiAuthRegisterPost$Response$User {
  const ApiAuthRegisterPost$Response$User({
    this.id,
    this.email,
    this.name,
    this.role,
  });

  factory ApiAuthRegisterPost$Response$User.fromJson(
    Map<String, dynamic> json,
  ) => _$ApiAuthRegisterPost$Response$UserFromJson(json);

  static const toJsonFactory = _$ApiAuthRegisterPost$Response$UserToJson;
  Map<String, dynamic> toJson() =>
      _$ApiAuthRegisterPost$Response$UserToJson(this);

  @JsonKey(name: 'id')
  final String? id;
  @JsonKey(name: 'email')
  final String? email;
  @JsonKey(name: 'name')
  final String? name;
  @JsonKey(name: 'role')
  final String? role;
  static const fromJsonFactory = _$ApiAuthRegisterPost$Response$UserFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiAuthRegisterPost$Response$User &&
            (identical(other.id, id) ||
                const DeepCollectionEquality().equals(other.id, id)) &&
            (identical(other.email, email) ||
                const DeepCollectionEquality().equals(other.email, email)) &&
            (identical(other.name, name) ||
                const DeepCollectionEquality().equals(other.name, name)) &&
            (identical(other.role, role) ||
                const DeepCollectionEquality().equals(other.role, role)));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(id) ^
      const DeepCollectionEquality().hash(email) ^
      const DeepCollectionEquality().hash(name) ^
      const DeepCollectionEquality().hash(role) ^
      runtimeType.hashCode;
}

extension $ApiAuthRegisterPost$Response$UserExtension
    on ApiAuthRegisterPost$Response$User {
  ApiAuthRegisterPost$Response$User copyWith({
    String? id,
    String? email,
    String? name,
    String? role,
  }) {
    return ApiAuthRegisterPost$Response$User(
      id: id ?? this.id,
      email: email ?? this.email,
      name: name ?? this.name,
      role: role ?? this.role,
    );
  }

  ApiAuthRegisterPost$Response$User copyWithWrapped({
    Wrapped<String?>? id,
    Wrapped<String?>? email,
    Wrapped<String?>? name,
    Wrapped<String?>? role,
  }) {
    return ApiAuthRegisterPost$Response$User(
      id: (id != null ? id.value : this.id),
      email: (email != null ? email.value : this.email),
      name: (name != null ? name.value : this.name),
      role: (role != null ? role.value : this.role),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiProductsIdGet$Response$Product {
  const ApiProductsIdGet$Response$Product({
    this.id,
    this.name,
    this.description,
    this.price,
    this.stockQuantity,
    this.isActive,
    this.images,
    this.category,
  });

  factory ApiProductsIdGet$Response$Product.fromJson(
    Map<String, dynamic> json,
  ) => _$ApiProductsIdGet$Response$ProductFromJson(json);

  static const toJsonFactory = _$ApiProductsIdGet$Response$ProductToJson;
  Map<String, dynamic> toJson() =>
      _$ApiProductsIdGet$Response$ProductToJson(this);

  @JsonKey(name: 'id')
  final String? id;
  @JsonKey(name: 'name')
  final String? name;
  @JsonKey(name: 'description')
  final String? description;
  @JsonKey(name: 'price')
  final double? price;
  @JsonKey(name: 'stockQuantity')
  final int? stockQuantity;
  @JsonKey(name: 'isActive')
  final bool? isActive;
  @JsonKey(name: 'images', defaultValue: <String>[])
  final List<String>? images;
  @JsonKey(name: 'category')
  final ApiProductsIdGet$Response$Product$Category? category;
  static const fromJsonFactory = _$ApiProductsIdGet$Response$ProductFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiProductsIdGet$Response$Product &&
            (identical(other.id, id) ||
                const DeepCollectionEquality().equals(other.id, id)) &&
            (identical(other.name, name) ||
                const DeepCollectionEquality().equals(other.name, name)) &&
            (identical(other.description, description) ||
                const DeepCollectionEquality().equals(
                  other.description,
                  description,
                )) &&
            (identical(other.price, price) ||
                const DeepCollectionEquality().equals(other.price, price)) &&
            (identical(other.stockQuantity, stockQuantity) ||
                const DeepCollectionEquality().equals(
                  other.stockQuantity,
                  stockQuantity,
                )) &&
            (identical(other.isActive, isActive) ||
                const DeepCollectionEquality().equals(
                  other.isActive,
                  isActive,
                )) &&
            (identical(other.images, images) ||
                const DeepCollectionEquality().equals(other.images, images)) &&
            (identical(other.category, category) ||
                const DeepCollectionEquality().equals(
                  other.category,
                  category,
                )));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(id) ^
      const DeepCollectionEquality().hash(name) ^
      const DeepCollectionEquality().hash(description) ^
      const DeepCollectionEquality().hash(price) ^
      const DeepCollectionEquality().hash(stockQuantity) ^
      const DeepCollectionEquality().hash(isActive) ^
      const DeepCollectionEquality().hash(images) ^
      const DeepCollectionEquality().hash(category) ^
      runtimeType.hashCode;
}

extension $ApiProductsIdGet$Response$ProductExtension
    on ApiProductsIdGet$Response$Product {
  ApiProductsIdGet$Response$Product copyWith({
    String? id,
    String? name,
    String? description,
    double? price,
    int? stockQuantity,
    bool? isActive,
    List<String>? images,
    ApiProductsIdGet$Response$Product$Category? category,
  }) {
    return ApiProductsIdGet$Response$Product(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      price: price ?? this.price,
      stockQuantity: stockQuantity ?? this.stockQuantity,
      isActive: isActive ?? this.isActive,
      images: images ?? this.images,
      category: category ?? this.category,
    );
  }

  ApiProductsIdGet$Response$Product copyWithWrapped({
    Wrapped<String?>? id,
    Wrapped<String?>? name,
    Wrapped<String?>? description,
    Wrapped<double?>? price,
    Wrapped<int?>? stockQuantity,
    Wrapped<bool?>? isActive,
    Wrapped<List<String>?>? images,
    Wrapped<ApiProductsIdGet$Response$Product$Category?>? category,
  }) {
    return ApiProductsIdGet$Response$Product(
      id: (id != null ? id.value : this.id),
      name: (name != null ? name.value : this.name),
      description: (description != null ? description.value : this.description),
      price: (price != null ? price.value : this.price),
      stockQuantity: (stockQuantity != null
          ? stockQuantity.value
          : this.stockQuantity),
      isActive: (isActive != null ? isActive.value : this.isActive),
      images: (images != null ? images.value : this.images),
      category: (category != null ? category.value : this.category),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiProductsGet$Response$Products$Item {
  const ApiProductsGet$Response$Products$Item({
    this.id,
    this.name,
    this.description,
    this.price,
    this.stockQuantity,
    this.isActive,
    this.images,
    this.category,
  });

  factory ApiProductsGet$Response$Products$Item.fromJson(
    Map<String, dynamic> json,
  ) => _$ApiProductsGet$Response$Products$ItemFromJson(json);

  static const toJsonFactory = _$ApiProductsGet$Response$Products$ItemToJson;
  Map<String, dynamic> toJson() =>
      _$ApiProductsGet$Response$Products$ItemToJson(this);

  @JsonKey(name: 'id')
  final String? id;
  @JsonKey(name: 'name')
  final String? name;
  @JsonKey(name: 'description')
  final String? description;
  @JsonKey(name: 'price')
  final double? price;
  @JsonKey(name: 'stockQuantity')
  final int? stockQuantity;
  @JsonKey(name: 'isActive')
  final bool? isActive;
  @JsonKey(name: 'images', defaultValue: <Object>[])
  final List<Object>? images;
  @JsonKey(name: 'category')
  final ApiProductsGet$Response$Products$Item$Category? category;
  static const fromJsonFactory =
      _$ApiProductsGet$Response$Products$ItemFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiProductsGet$Response$Products$Item &&
            (identical(other.id, id) ||
                const DeepCollectionEquality().equals(other.id, id)) &&
            (identical(other.name, name) ||
                const DeepCollectionEquality().equals(other.name, name)) &&
            (identical(other.description, description) ||
                const DeepCollectionEquality().equals(
                  other.description,
                  description,
                )) &&
            (identical(other.price, price) ||
                const DeepCollectionEquality().equals(other.price, price)) &&
            (identical(other.stockQuantity, stockQuantity) ||
                const DeepCollectionEquality().equals(
                  other.stockQuantity,
                  stockQuantity,
                )) &&
            (identical(other.isActive, isActive) ||
                const DeepCollectionEquality().equals(
                  other.isActive,
                  isActive,
                )) &&
            (identical(other.images, images) ||
                const DeepCollectionEquality().equals(other.images, images)) &&
            (identical(other.category, category) ||
                const DeepCollectionEquality().equals(
                  other.category,
                  category,
                )));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(id) ^
      const DeepCollectionEquality().hash(name) ^
      const DeepCollectionEquality().hash(description) ^
      const DeepCollectionEquality().hash(price) ^
      const DeepCollectionEquality().hash(stockQuantity) ^
      const DeepCollectionEquality().hash(isActive) ^
      const DeepCollectionEquality().hash(images) ^
      const DeepCollectionEquality().hash(category) ^
      runtimeType.hashCode;
}

extension $ApiProductsGet$Response$Products$ItemExtension
    on ApiProductsGet$Response$Products$Item {
  ApiProductsGet$Response$Products$Item copyWith({
    String? id,
    String? name,
    String? description,
    double? price,
    int? stockQuantity,
    bool? isActive,
    List<Object>? images,
    ApiProductsGet$Response$Products$Item$Category? category,
  }) {
    return ApiProductsGet$Response$Products$Item(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      price: price ?? this.price,
      stockQuantity: stockQuantity ?? this.stockQuantity,
      isActive: isActive ?? this.isActive,
      images: images ?? this.images,
      category: category ?? this.category,
    );
  }

  ApiProductsGet$Response$Products$Item copyWithWrapped({
    Wrapped<String?>? id,
    Wrapped<String?>? name,
    Wrapped<String?>? description,
    Wrapped<double?>? price,
    Wrapped<int?>? stockQuantity,
    Wrapped<bool?>? isActive,
    Wrapped<List<Object>?>? images,
    Wrapped<ApiProductsGet$Response$Products$Item$Category?>? category,
  }) {
    return ApiProductsGet$Response$Products$Item(
      id: (id != null ? id.value : this.id),
      name: (name != null ? name.value : this.name),
      description: (description != null ? description.value : this.description),
      price: (price != null ? price.value : this.price),
      stockQuantity: (stockQuantity != null
          ? stockQuantity.value
          : this.stockQuantity),
      isActive: (isActive != null ? isActive.value : this.isActive),
      images: (images != null ? images.value : this.images),
      category: (category != null ? category.value : this.category),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiProductsIdGet$Response$Product$Category {
  const ApiProductsIdGet$Response$Product$Category({this.id, this.name});

  factory ApiProductsIdGet$Response$Product$Category.fromJson(
    Map<String, dynamic> json,
  ) => _$ApiProductsIdGet$Response$Product$CategoryFromJson(json);

  static const toJsonFactory =
      _$ApiProductsIdGet$Response$Product$CategoryToJson;
  Map<String, dynamic> toJson() =>
      _$ApiProductsIdGet$Response$Product$CategoryToJson(this);

  @JsonKey(name: 'id')
  final String? id;
  @JsonKey(name: 'name')
  final String? name;
  static const fromJsonFactory =
      _$ApiProductsIdGet$Response$Product$CategoryFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiProductsIdGet$Response$Product$Category &&
            (identical(other.id, id) ||
                const DeepCollectionEquality().equals(other.id, id)) &&
            (identical(other.name, name) ||
                const DeepCollectionEquality().equals(other.name, name)));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(id) ^
      const DeepCollectionEquality().hash(name) ^
      runtimeType.hashCode;
}

extension $ApiProductsIdGet$Response$Product$CategoryExtension
    on ApiProductsIdGet$Response$Product$Category {
  ApiProductsIdGet$Response$Product$Category copyWith({
    String? id,
    String? name,
  }) {
    return ApiProductsIdGet$Response$Product$Category(
      id: id ?? this.id,
      name: name ?? this.name,
    );
  }

  ApiProductsIdGet$Response$Product$Category copyWithWrapped({
    Wrapped<String?>? id,
    Wrapped<String?>? name,
  }) {
    return ApiProductsIdGet$Response$Product$Category(
      id: (id != null ? id.value : this.id),
      name: (name != null ? name.value : this.name),
    );
  }
}

@JsonSerializable(explicitToJson: true)
class ApiProductsGet$Response$Products$Item$Category {
  const ApiProductsGet$Response$Products$Item$Category({this.id, this.name});

  factory ApiProductsGet$Response$Products$Item$Category.fromJson(
    Map<String, dynamic> json,
  ) => _$ApiProductsGet$Response$Products$Item$CategoryFromJson(json);

  static const toJsonFactory =
      _$ApiProductsGet$Response$Products$Item$CategoryToJson;
  Map<String, dynamic> toJson() =>
      _$ApiProductsGet$Response$Products$Item$CategoryToJson(this);

  @JsonKey(name: 'id')
  final String? id;
  @JsonKey(name: 'name')
  final String? name;
  static const fromJsonFactory =
      _$ApiProductsGet$Response$Products$Item$CategoryFromJson;

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other is ApiProductsGet$Response$Products$Item$Category &&
            (identical(other.id, id) ||
                const DeepCollectionEquality().equals(other.id, id)) &&
            (identical(other.name, name) ||
                const DeepCollectionEquality().equals(other.name, name)));
  }

  @override
  String toString() => jsonEncode(this);

  @override
  int get hashCode =>
      const DeepCollectionEquality().hash(id) ^
      const DeepCollectionEquality().hash(name) ^
      runtimeType.hashCode;
}

extension $ApiProductsGet$Response$Products$Item$CategoryExtension
    on ApiProductsGet$Response$Products$Item$Category {
  ApiProductsGet$Response$Products$Item$Category copyWith({
    String? id,
    String? name,
  }) {
    return ApiProductsGet$Response$Products$Item$Category(
      id: id ?? this.id,
      name: name ?? this.name,
    );
  }

  ApiProductsGet$Response$Products$Item$Category copyWithWrapped({
    Wrapped<String?>? id,
    Wrapped<String?>? name,
  }) {
    return ApiProductsGet$Response$Products$Item$Category(
      id: (id != null ? id.value : this.id),
      name: (name != null ? name.value : this.name),
    );
  }
}

String? apiAdminUsersIdPatch$RequestBodyRoleNullableToJson(
  enums.ApiAdminUsersIdPatch$RequestBodyRole?
  apiAdminUsersIdPatch$RequestBodyRole,
) {
  return apiAdminUsersIdPatch$RequestBodyRole?.value;
}

String? apiAdminUsersIdPatch$RequestBodyRoleToJson(
  enums.ApiAdminUsersIdPatch$RequestBodyRole
  apiAdminUsersIdPatch$RequestBodyRole,
) {
  return apiAdminUsersIdPatch$RequestBodyRole.value;
}

enums.ApiAdminUsersIdPatch$RequestBodyRole
apiAdminUsersIdPatch$RequestBodyRoleFromJson(
  Object? apiAdminUsersIdPatch$RequestBodyRole, [
  enums.ApiAdminUsersIdPatch$RequestBodyRole? defaultValue,
]) {
  return enums.ApiAdminUsersIdPatch$RequestBodyRole.values.firstWhereOrNull(
        (e) => e.value == apiAdminUsersIdPatch$RequestBodyRole,
      ) ??
      defaultValue ??
      enums.ApiAdminUsersIdPatch$RequestBodyRole.swaggerGeneratedUnknown;
}

enums.ApiAdminUsersIdPatch$RequestBodyRole?
apiAdminUsersIdPatch$RequestBodyRoleNullableFromJson(
  Object? apiAdminUsersIdPatch$RequestBodyRole, [
  enums.ApiAdminUsersIdPatch$RequestBodyRole? defaultValue,
]) {
  if (apiAdminUsersIdPatch$RequestBodyRole == null) {
    return null;
  }
  return enums.ApiAdminUsersIdPatch$RequestBodyRole.values.firstWhereOrNull(
        (e) => e.value == apiAdminUsersIdPatch$RequestBodyRole,
      ) ??
      defaultValue;
}

String apiAdminUsersIdPatch$RequestBodyRoleExplodedListToJson(
  List<enums.ApiAdminUsersIdPatch$RequestBodyRole>?
  apiAdminUsersIdPatch$RequestBodyRole,
) {
  return apiAdminUsersIdPatch$RequestBodyRole?.map((e) => e.value!).join(',') ??
      '';
}

List<String> apiAdminUsersIdPatch$RequestBodyRoleListToJson(
  List<enums.ApiAdminUsersIdPatch$RequestBodyRole>?
  apiAdminUsersIdPatch$RequestBodyRole,
) {
  if (apiAdminUsersIdPatch$RequestBodyRole == null) {
    return [];
  }

  return apiAdminUsersIdPatch$RequestBodyRole.map((e) => e.value!).toList();
}

List<enums.ApiAdminUsersIdPatch$RequestBodyRole>
apiAdminUsersIdPatch$RequestBodyRoleListFromJson(
  List? apiAdminUsersIdPatch$RequestBodyRole, [
  List<enums.ApiAdminUsersIdPatch$RequestBodyRole>? defaultValue,
]) {
  if (apiAdminUsersIdPatch$RequestBodyRole == null) {
    return defaultValue ?? [];
  }

  return apiAdminUsersIdPatch$RequestBodyRole
      .map((e) => apiAdminUsersIdPatch$RequestBodyRoleFromJson(e.toString()))
      .toList();
}

List<enums.ApiAdminUsersIdPatch$RequestBodyRole>?
apiAdminUsersIdPatch$RequestBodyRoleNullableListFromJson(
  List? apiAdminUsersIdPatch$RequestBodyRole, [
  List<enums.ApiAdminUsersIdPatch$RequestBodyRole>? defaultValue,
]) {
  if (apiAdminUsersIdPatch$RequestBodyRole == null) {
    return defaultValue;
  }

  return apiAdminUsersIdPatch$RequestBodyRole
      .map((e) => apiAdminUsersIdPatch$RequestBodyRoleFromJson(e.toString()))
      .toList();
}

typedef $JsonFactory<T> = T Function(Map<String, dynamic> json);

class $CustomJsonDecoder {
  $CustomJsonDecoder(this.factories);

  final Map<Type, $JsonFactory> factories;

  dynamic decode<T>(dynamic entity) {
    if (entity is Iterable) {
      return _decodeList<T>(entity);
    }

    if (entity is T) {
      return entity;
    }

    if (isTypeOf<T, Map>()) {
      return entity;
    }

    if (isTypeOf<T, Iterable>()) {
      return entity;
    }

    if (entity is Map<String, dynamic>) {
      return _decodeMap<T>(entity);
    }

    return entity;
  }

  T _decodeMap<T>(Map<String, dynamic> values) {
    final jsonFactory = factories[T];
    if (jsonFactory == null || jsonFactory is! $JsonFactory<T>) {
      return throw "Could not find factory for type $T. Is '$T: $T.fromJsonFactory' included in the CustomJsonDecoder instance creation in bootstrapper.dart?";
    }

    return jsonFactory(values);
  }

  List<T> _decodeList<T>(Iterable values) =>
      values.where((v) => v != null).map<T>((v) => decode<T>(v) as T).toList();
}

class $JsonSerializableConverter extends chopper.JsonConverter {
  @override
  FutureOr<chopper.Response<ResultType>> convertResponse<ResultType, Item>(
    chopper.Response response,
  ) async {
    if (response.bodyString.isEmpty) {
      // In rare cases, when let's say 204 (no content) is returned -
      // we cannot decode the missing json with the result type specified
      return chopper.Response(response.base, null, error: response.error);
    }

    if (ResultType == String) {
      return response.copyWith();
    }

    if (ResultType == DateTime) {
      return response.copyWith(
        body:
            DateTime.parse((response.body as String).replaceAll('"', ''))
                as ResultType,
      );
    }

    final jsonRes = await super.convertResponse(response);
    return jsonRes.copyWith<ResultType>(
      body: $jsonDecoder.decode<Item>(jsonRes.body) as ResultType,
    );
  }
}

final $jsonDecoder = $CustomJsonDecoder(generatedMapping);

// ignore: unused_element
String? _dateToJson(DateTime? date) {
  if (date == null) {
    return null;
  }

  final year = date.year.toString();
  final month = date.month < 10 ? '0${date.month}' : date.month.toString();
  final day = date.day < 10 ? '0${date.day}' : date.day.toString();

  return '$year-$month-$day';
}

class Wrapped<T> {
  final T value;
  const Wrapped.value(this.value);
}
