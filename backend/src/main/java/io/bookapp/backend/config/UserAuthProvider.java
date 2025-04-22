package io.bookapp.backend.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.bookapp.backend.dto.UserDto;
import io.bookapp.backend.services.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Collections;
import java.util.Date;

@RequiredArgsConstructor
@Component
public class UserAuthProvider {

    // use default "secret-value"; TODO: maybe change this later
    @Value("${security.jwt.token.secret-key:secret-value}")
    private String secretKey;
    private final UserService userService;

    @PostConstruct // runs once right after the bean is initialized and dependencies are injected
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createToken(String login) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 3_600_000); // Token valid for one hour

        return JWT.create()
                .withIssuer(login)
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .sign(Algorithm.HMAC256(secretKey));
    }

    public Authentication validateToken(String token) {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secretKey)).build();
        DecodedJWT decoded = verifier.verify(token);
        UserDto user = userService.findByLogin(decoded.getIssuer());
        // return Auth object wit user dto as principal
        // TODO: maybe use UserPrincipal object (implementing UserDetails) here
        return new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
    }
}
