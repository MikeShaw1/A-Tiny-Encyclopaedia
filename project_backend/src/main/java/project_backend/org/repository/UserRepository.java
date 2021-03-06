package project_backend.org.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project_backend.org.entity.User;

import java.util.List;
public interface UserRepository extends JpaRepository<User,Integer>{
    @Query(value = "from User where username = :username and password = :password")
    User checkUser(@Param("username") String username, @Param("password") String password);

    @Query("select b from User b")
    List<User> getUsers();

    @Query(value= "from User where username = :username")
    User findByName(@Param("username") String username);
}
