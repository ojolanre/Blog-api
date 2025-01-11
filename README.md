# Blog API Documentation

This document provides comprehensive information for using the Blogging API for postman.

## General API Information

*   **API Base URL:**
    `http://localhost:3000` (This is your local base URL.)
*   **Authentication:**
    *   JWT (JSON Web Token) is used for authentication after successful sign-in.
    *   Tokens should be sent in the `Authorization` header as `Bearer <token>`.
    *   Tokens are sent back to the user when they successfully sign in or sign up, through cookies. You must access these cookies and use the token to authenticate your subsequent requests.

## Endpoint Documentation

### 1. `POST /auth/signup`

*   **Description:** Creates a new user.
*   **Request Body:**

    ```json
    {
        "first_name": "string (required)",
        "last_name": "string (required)",
        "email": "string (required, unique)",
        "password": "string (required)"
    }
    ```

*   **Success Response (201):**

    ```json
    {
        "message": "User created successfully",
        "token": "string"
    }
    ```
    * The token is also sent as a httpOnly cookie in the `set-cookie` header.
*   **Error Response (400):**

    ```json
    {
        "message": "Email already in use"
    }
    ```
*   **Error Response (500):**

    ```json
    {
        "message": "Error signing up",
        "error": "<error message>"
    }
    ```

### 2. `POST /auth/signin`

*   **Description:** Logs in an existing user.
*   **Request Body:**

    ```json
    {
        "email": "string (required)",
        "password": "string (required)"
    }
    ```

*   **Success Response (200):**

    ```json
    {
      "message": "Logged in successfully",
      "token": "string"
    }
    ```
     * The token is also sent as a httpOnly cookie in the `set-cookie` header.
*   **Error Response (401):**

    ```json
    {
        "message": "Invalid credentials"
    }
    ```
*  **Error Response (500):**

    ```json
    {
        "message": "Error signing in",
        "error": "<error message>"
    }
    ```

### 3. `POST /blogs` (Protected - Requires JWT)

*   **Description:** Creates a new blog post (requires authentication)
*   **Headers:**
    *   `Authorization`: `Bearer <your_token>`
*   **Request Body:**

    ```json
    {
        "title": "string (required)",
        "description": "string (required)",
        "tags": ["string"],
        "body": "string (required)"
    }
    ```

*   **Success Response (201):**

    ```json
    {
       //Blog object
    }
    ```
*   **Error Response (401):**

    ```json
      {
        "message": "Authorization failed"
      }
    ```
      * This is returned if the user does not send a token or if the token is invalid.
*   **Error Response (500):**

    ```json
    {
        "message": "Error creating blog",
        "error": "<error message>"
    }
    ```

### 4. `GET /blogs`

*   **Description:** Get a list of published blogs. Can be accessed by both logged in and not logged in users.
*   **Optional Query Parameters:**
    *   `state` (`string: "published" or "draft"`): Filter by state.
    *   `page` (`number`, default `1`): Page number for pagination.
    *   `pageSize` (`number`, default `20`): Number of blogs to return per page.
    *   `author` (`string`): Search for blogs by the author's name.
    *   `title` (`string`): Search for blogs by title.
    *   `tags` (`string` or `array`): Search for blogs by tags.
    *   `orderBy` (`string`): The field to sort by can be `read_count`, `reading_time`, and `timestamp`. Default `timestamp`.
*   **Success Response (200):**

    ```json
        [
          {
             //Blog object
           },
         {
            //Blog Object
           }
         ]
    ```

### 5. `GET /blogs/:blogId`

*   **Description:** Get a specific blog post (requires no authentication).
*   **Path Parameter:** `blogId` is the ID of the blog post you want to retrieve.
*   **Success Response (200):**

    ```json
    {
       // Blog Object
       "author": {
           //User Object
       }
     }
    ```
    * The `read_count` will be increased by one every time this endpoint is accessed.
*   **Error Response (404):**

    ```json
    {
      "message": "Blog not found"
    }
    ```
*   **Error Response (500):**

    ```json
    {
      "message": "Error getting blog",
        "error": "<error message>"
    }
    ```

### 6. `GET /blogs/user`

*   **Description:** Get a list of blogs created by the current user (requires authentication).
*   **Headers:** `Authorization`: `Bearer <your_token>`.
*   **Success Response (200):**

    ```json
    [
       {
        //Blog Object
       },
      {
       //Blog object
       }
    ]
    ```
*   **Error Response (401):**

    ```json
      {
        "message": "Authorization failed"
        }
    ```
       * This is returned if the user does not send a token, or if the token is invalid.
*   **Error Response (500):**
       ```json
      {
         "message": "Error getting user's blog",
           "error": "<error message>"
       }
       ```

### 7. `PATCH /blogs/:blogId` or `PUT /blogs/:blogId` (Protected - Requires JWT)

*   **Description:** Update a specific blog post (requires authentication by the owner of the post).
*   **Path Parameter:** `blogId` is the ID of the blog post you want to update.
*   **Headers:**
    *   `Authorization`: `Bearer <your_token>`
*  **Request Body:**
    *  Any of the following properties can be sent.
        ```json
         {
           "title": "string",
            "description": "string",
           "tags": ["string"],
           "body": "string",
          "state": "string ('draft' or 'published')"
         }
       ```
        * All of the above are optional parameters.
        * If you want to change the state of the blog, you need to include the state parameter.
*   **Success Response (200):**

    ```json
       {
         "message": "Blog updated successfully",
         "blog": {
              // updated blog properties
         }
       }
    ```
*   **Error Response (401):**

    ```json
     {
        "message": "Authorization failed"
     }
     ```
      * This is returned if the token is invalid or missing.
*   **Error Response (403):**

    ```json
     {
       "message": "You do not have permissions to perform this operation"
     }
    ```
        * This is returned if you are trying to access the route without being the owner of the blog.
*   **Error Response (404):**

    ```json
       {
        "message": "Blog not found"
      }
      ```
    * This is returned if the blog is not found.
*   **Error Response (500):**

    ```json
    {
        "message": "Error updating blog",
        "error": "<error message>"
    }
    ```

### 8. `DELETE /blogs/:blogId` (Protected - Requires JWT)

*   **Description:** Deletes a specific blog post (requires authentication by the owner of the blog).
*   **Path Parameter:** `blogId` is the ID of the blog you want to delete.
*   **Headers:**
    *   `Authorization`: `Bearer <your_token>`
*   **Success Response (200):**

    ```json
    {
        "message": "Blog deleted successfully"
    }
    ```
      * This indicates that the blog was successfully deleted.
*   **Error Response (401):**

    ```json
     {
        "message": "Authorization failed"
     }
    ```
      * This is returned if the token is missing or invalid.
*    **Error Response (403):**
    
    ``` json
    {
        "message": "You do not have permissions to perform this operation"
    }
  
    
     * This is returned if you are not the owner of the blog.
 *  **Error Response (404):**

    ```json
      {
         "message": "Blog not found"
     }
      ```
    * This is returned when the blog is not found.
*   **Error Response (500):**

    ```json
    {
        "message": "Error deleting blog",
       "error": "<error message>"
    }
    ```
