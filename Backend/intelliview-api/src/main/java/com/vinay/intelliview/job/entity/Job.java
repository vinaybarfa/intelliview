package com.vinay.intelliview.job.entity;

import com.vinay.intelliview.common.BaseEntity;
import com.vinay.intelliview.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Job extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 150)
    private String companyName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(length = 150)
    private String location;

    @Column(length = 50)
    private String employmentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private JobStatus status;
}