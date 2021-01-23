# ${title}

#### 接口说明

> 接口用来获取用户的基本信息。

接口地址：`${url}`

接口方法：`${method}`

#### 请求头 [headers]

```
示例：
{
    "Content-Type":"application/x-www-form-urlencoded"
}
```

| 参数         | 值                                  | 是否必填 | 说明       |
| ------------ | ----------------------------------- | -------- | ---------- |
| Content-Type | `application/x-www-form-urlencoded` | 是       | 请求的类型 |

#### 请求参数 [params]

```
示例：${url}/?id=8235&role=admin
```

| 参数 | 类型     | 值           | 是否必填 | 说明           |
| ---- | -------- | ------------ | -------- | -------------- |
| id   | `String` | 8235         | √        | 请求的用户 ID  |
| role | `String` | admin,editor | √        | 请求的用户角色 |

#### 请求体 [bady]

```
示例：
{
	id : 8235,
	role : "admin"
}
```

| 参数 | 类型     | 值           | 是否必填 | 说明           |
| ---- | -------- | ------------ | -------- | -------------- |
| id   | `String` | 8235         | √        | 请求的用户 ID  |
| role | `String` | admin,editor | √        | 请求的用户角色 |

#### 成功返回 [success]

```
示例：
{
	id : 8235,
	nickname : "admin",
	age: 18
}
```

| 参数     | 类型             | 值    | 说明       |
| -------- | ---------------- | ----- | ---------- |
| id       | `String`         | 9827  | 用户 ID    |
| nickname | `String, “”`     | admin | 用户的昵称 |
| age      | `number, String` | 12    | 用户的年龄 |

#### 失败返回 [fail]

```
示例：
{
	code : 401,
	message : "用户未登录",
}
```

| 参数    | 类型     | 值       | 说明                                                      |
| ------- | -------- | -------- | --------------------------------------------------------- |
| code    | `Number` | 401      | [状态码](https://github.com/pandao/editor.md "Editor.md") |
| message | `String` | 登录失败 | 失败信息                                                  |
