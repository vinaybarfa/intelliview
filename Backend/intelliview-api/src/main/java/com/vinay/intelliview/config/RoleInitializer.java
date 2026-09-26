package com.vinay.intelliview.config;

import com.vinay.intelliview.user.entity.Role;
import com.vinay.intelliview.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;

@RequiredArgsConstructor
public class RoleInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        createRoleIfNotExists("ROLE_USER");
        createRoleIfNotExists("ROLE_ADMIN");
    }

    private void createRoleIfNotExists(String roleName) {

        if (!roleRepository.existsByName(roleName)) {

            Role role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
        }
    }


}
